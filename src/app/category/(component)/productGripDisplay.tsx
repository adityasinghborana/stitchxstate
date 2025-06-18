'use client';

import { ProductEntity } from '@/core/entities/product.entity';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ProductGridDisplayProps {
  products: ProductEntity[];
}

// Helper function to get a comma-separated list of sizes from variations
const getAvailableSizes = (product: ProductEntity): string => {
  if (!product.variations || product.variations.length === 0) {
    return 'N/A';
  }
  // Get unique sizes and join them
  const sizes = Array.from(new Set(product.variations.map(v => v.size)));
  return sizes.join(', ');
};

export default function ProductGridDisplay({ products }: ProductGridDisplayProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-lg">
        No products available to display in this category.
      </div>
    );
  }
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((product) => {
        // Find the first image from the first variation for the main product card image
        const mainImageUrl = product.variations && product.variations[0] && product.variations[0].images && product.variations[0].images[0]
          ? product.variations[0].images[0].url
          : 'https://placehold.co/400x600/e0e0e0/ffffff?text=No+Image'; // Placeholder if no image

       const displayPrice = product.variations && product.variations.length > 0
          ? product.variations[0].price
          : null; // Or some default value like 0 or 'N/A'

        const availableSizes = getAvailableSizes(product);

        return (
          <Link
            key={product.id}
            href={`/products/${product.id}`} 
            className="block group relative bg-white rounded-lg  overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative w-full h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
              <Image
                src={mainImageUrl}
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="transition-transform duration-300 group-hover:scale-105"
              />

              {/* WISHLIST icon/button - placeholder */}
              <button
                type="button"
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-red-500 hover:scale-110 transition-transform duration-200 z-10"
                aria-label="Add to wishlist"
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigating to product page
                  alert('Wishlist functionality coming soon!');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Discount Tag (REMOVED: as originalPrice is no longer in ProductEntity) */}

              {/* Rating Placeholder (using unicode star and mock count) */}
              {/* <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 rounded-full px-2 py-1 text-xs font-semibold flex items-center shadow-md z-10">
                ⭐ 4.4 | 19.1k
              </div> */}
            </div>

            <div className="p-4 bg-white">
              {/* Brand Name Placeholder - if you had a 'brand' field in ProductEntity */}
              <p className="text-sm text-gray-500 mb-1">Anouk</p> {/* Placeholder Brand */}
              <h3 className="text-base font-semibold text-gray-800 line-clamp-2">{product.name}</h3>

              {/* Sizes */}
              <p className="text-xs text-gray-600 mt-2">Sizes: {availableSizes}</p>

              {/* Price (Simplified, no originalPrice) */}
              <div className="flex items-baseline mt-2">
                <span className="text-lg font-bold text-gray-900">
                  {displayPrice !== null ? `Rs. ${displayPrice.toFixed(0)}` : 'Price N/A'}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
