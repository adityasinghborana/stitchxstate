"use client";

import { ProductEntity } from "@/core/entities/product.entity";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { ProductFilters, FilterOptions } from "@/components/ui/product-filters";

interface ProductGridDisplayProps {
  products: ProductEntity[];
}

/** Return a comma‑separated list of unique sizes from all variations */
const getAvailableSizes = (product: ProductEntity): string => {
  if (!product.variations?.length) return "N/A";
  const sizes = Array.from(new Set(product.variations.map((v) => v.size)));
  return sizes.join(", ");
};

/** Calculate percentage off (rounded) */
const getDiscountPercent = (price: number, salePrice: number) =>
  Math.max(0, Math.round(((price - salePrice) / price) * 100));

/** Get the best media (video first, then image) */
const getBestMedia = (product: ProductEntity) => {
  const variation = product.variations?.[0];

  // Check for video first in product entity
  if (product.thumbnailVideo) {
    return {
      type: "video" as const,
      url: product.thumbnailVideo,
      alt: product.name,
    };
  }

  // Check for images in variation
  if (variation?.images?.length > 0) {
    return {
      type: "image" as const,
      url: variation.images[0].url,
      alt: product.name,
    };
  }

  // Check gallery images
  if (product.galleryImages?.length > 0) {
    return {
      type: "image" as const,
      url: product.galleryImages[0].url,
      alt: product.name,
    };
  }

  // Fallback
  return {
    type: "image" as const,
    url: "https://placehold.co/400x600/e0e0e0/ffffff?text=No+Image",
    alt: product.name,
  };
};

/** Extract all available filter options from products */
const extractFilterOptions = (products: ProductEntity[]) => {
  const sizes = new Set<string>();
  const colors = new Set<string>();
  const brands = new Set<string>();
  let maxPrice = 0;

  products.forEach((product) => {
    product.variations?.forEach((variation) => {
      sizes.add(variation.size);
      colors.add(variation.color);
      maxPrice = Math.max(maxPrice, variation.price);
    });
  });

  return {
    sizes: Array.from(sizes).sort(),
    colors: Array.from(colors).sort(),
    brands: Array.from(brands).sort(),
    maxPrice,
  };
};

/** Filter products based on filter options */
const filterProducts = (
  products: ProductEntity[],
  filters: FilterOptions
): ProductEntity[] => {
  return products.filter((product) => {
    const variation = product.variations?.[0];
    if (!variation) return false;

    // Price range filter
    if (
      variation.price < filters.priceRange[0] ||
      variation.price > filters.priceRange[1]
    ) {
      return false;
    }

    // Size filter
    if (
      filters.sizes.length > 0 &&
      !filters.sizes.some((size) =>
        product.variations?.some((v) => v.size === size)
      )
    ) {
      return false;
    }

    // Color filter
    if (
      filters.colors.length > 0 &&
      !filters.colors.some((color) =>
        product.variations?.some((v) => v.color === color)
      )
    ) {
      return false;
    }

    // Brand filter (assuming brand is in product name or description)
    if (
      filters.brands.length > 0 &&
      !filters.brands.some((brand) =>
        product.name.toLowerCase().includes(brand.toLowerCase())
      )
    ) {
      return false;
    }

    // In stock filter
    if (filters.inStock && !product.variations?.some((v) => v.stock > 0)) {
      return false;
    }

    // On sale filter
    if (
      filters.onSale &&
      !product.variations?.some((v) => v.salePrice > 0 && v.salePrice < v.price)
    ) {
      return false;
    }

    return true;
  });
};

export default function ProductGridDisplay({
  products,
}: ProductGridDisplayProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    sizes: [],
    colors: [],
    brands: [],
    inStock: false,
    onSale: false,
  });

  const filterOptions = useMemo(
    () => extractFilterOptions(products),
    [products]
  );
  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  );

  if (!products?.length) {
    return (
      <div className="text-center py-8 text-gray-500 text-lg">
        No products available to display in this category.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ProductFilters
        availableSizes={filterOptions.sizes}
        availableColors={filterOptions.colors}
        availableBrands={filterOptions.brands}
        maxPrice={filterOptions.maxPrice}
        onFiltersChange={setFilters}
        currentFilters={filters}
      />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more products.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {filteredProducts.map((product) => {
            const variation = product.variations?.[0];
            const media = getBestMedia(product);

            const price = variation?.price ?? 0;
            const salePrice = variation?.salePrice ?? 0;
            const hasSale = salePrice > 0 && salePrice < price;
            const discount = hasSale ? getDiscountPercent(price, salePrice) : 0;

            const availableSizes = getAvailableSizes(product);

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="block group relative bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* ---------- Media block (Video or Image) ---------- */}
                <div className="relative w-full h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {media.type === "video" ? (
                    <video
                      src={media.url}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => {
                        const video = e.currentTarget as HTMLVideoElement;
                        video.play().catch(() => {
                          // Handle autoplay restrictions
                        });
                      }}
                      onMouseLeave={(e) => {
                        const video = e.currentTarget as HTMLVideoElement;
                        video.pause();
                        video.currentTime = 0;
                      }}
                    />
                  ) : (
                    <Image
                      src={media.url}
                      alt={media.alt}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width:640px)100vw,(max-width:768px)50vw,(max-width:1024px)33vw,25vw"
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  {/* Video play indicator */}
                  {media.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="bg-black/50 rounded-full p-2">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Wishlist button */}
                  <button
                    type="button"
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-red-500 hover:scale-110 transition-transform duration-200 z-10"
                    aria-label="Add to wishlist"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Wishlist functionality coming soon!");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Discount badge (only when on sale) */}
                  {hasSale && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded z-10 shadow">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                {/* ---------- Info block ---------- */}
                <div className="p-4 bg-white">
                  <p className="text-sm text-gray-500 mb-1">Anouk</p>{" "}
                  {/* example brand */}
                  <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
                    {product.name}
                  </h3>
                  {/* Sizes */}
                  <p className="text-xs text-gray-600 mt-2">
                    Sizes: {availableSizes}
                  </p>
                  {/* ---------- Price ---------- */}
                  <div className="flex items-baseline mt-2 gap-2">
                    {hasSale ? (
                      <>
                        <span className="text-lg font-bold text-red-600">
                          Rs. {salePrice.toFixed(0)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          Rs. {price.toFixed(0)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        Rs. {price.toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
