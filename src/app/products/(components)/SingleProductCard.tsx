'use client'
import React, { useState } from 'react';

import { ProductEntity,ProductImageEntity,ProductVariationEntity } from '@/core/entities/product.entity'; 
import { Button } from '@/components/ui/button';
import ShippingInfo from './ShippingInfo';
interface SingleProductCardProps {
  product: ProductEntity;
}

const SingleProductCard: React.FC<SingleProductCardProps> = ({ product }) => {
  // State for selected variation (for size /color)
  // Initialize with the first variation if available, or null
  const [selectedVariation, setSelectedVariation] = useState<ProductVariationEntity | null>(
    product.variations && product.variations.length > 0 ? product.variations[0] : null
  );

  // State for the main image displayed
  // Initialize with the first image of the selected variation, or null
  const [mainImage, setMainImage] = useState<ProductImageEntity | null>(
    selectedVariation && selectedVariation.images.length > 0 ? selectedVariation.images[0] : null
  );

  // Update main image and selected variation when a new variation is chosen
  const handleVariationChange = (variation: ProductVariationEntity) => {
    setSelectedVariation(variation);
    if (variation.images.length > 0) {
      setMainImage(variation.images[0]);
    } else {
      setMainImage(null);
    }
  };

  // Update main image when a thumbnail is clicked
  const handleThumbnailClick = (image: ProductImageEntity) => {
    setMainImage(image);
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg shadow-md m-4">
        <p className="text-gray-600 text-lg">Product data is not available.</p>
      </div>
    );
  }

  // Determine if there are sizes other than "Standard" or if there's only one size
  const hasMultipleSizes = new Set(product.variations?.map(v => v.size)).size > 1;
  const sizes = Array.from(new Set(product.variations?.map(v => v.size))).sort();

  // Determine if there are multiple colors for the selected size
  const colorsForSelectedSize = selectedVariation
    ? Array.from(new Set(product.variations?.filter(v => v.size === selectedVariation.size).map(v => v.color)))
    : [];
  const hasMultipleColors = colorsForSelectedSize.length > 1;

  const handleAddToCart = () => {
    showCustomMessage('Product added to cart!');
  };

  const handleBuyNow = () => {
    showCustomMessage('Proceeding to checkout for this product.');
  };

  // Function to show a custom message box (replacement for alert/confirm)
  const showCustomMessage = (message: string) => {
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    messageBox.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm mx-auto">
        <p class="text-lg font-semibold mb-4">${message}</p>
        <button id="closeMessageBox" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById('closeMessageBox')?.addEventListener('click', () => {
      document.body.removeChild(messageBox);
    });
  };

  // Determine stock status for the selected variation
  const stockStatus = selectedVariation ? selectedVariation.stock : 0;
  const isLowStock = stockStatus > 0 && stockStatus <= 5; // Example threshold for low stock
  const isInStock = stockStatus > 0;

  return (
    <div className='w-full bg-white mx-auto'>
        <div className="flex flex-col lg:flex-row bg-white  overflow-hidden max-w-6xl mx-auto my-8 font-inter">
      {/* Image Gallery */}
      <div className="w-full lg:w-1/2 flex flex-col md:flex-row p-4 items-center">
        {/* Thumbnails */}
        <div className="flex flex-row md:flex-col gap-3 p-2 border-r-0 md:border-r border-gray-200">
          {product.variations?.flatMap(v => v.images).filter((image, index, self) =>
            index === self.findIndex((t) => (
              t.url === image.url // Filter for unique images across variations
            ))
          ).map((image) => (
            <div
              key={image.id}
              className={`w-20 h-20 relative rounded-md overflow-hidden cursor-pointer shadow-sm
                ${mainImage?.url === image.url ? 'border-2 border-blue-500' : 'border border-gray-200'}`}
              onClick={() => handleThumbnailClick(image)}
            >
              <img
                src={image.url}
                alt={`Thumbnail of ${product.name}`}
                className="w-full h-full object-cover rounded-md"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/80x80/cccccc/ffffff?text=Image+Error`;
                }}
              />
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div className="flex-grow p-4 flex justify-center items-center w-full aspect-square">
          {mainImage ? (
            <div className="relative w-full h-full">
              <img
                src={mainImage.url}
                alt={`${product.name} - Main Image`}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/600x600/cccccc/ffffff?text=Image+Error`;
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="w-full lg:w-1/2 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-700 mb-4">
            Rs. {selectedVariation ? selectedVariation.price.toFixed(2) : 'N/A'}
          </p>
            <div className="w-full border-t border-gray-300"></div>
          {/* Size Selection - Only show if there are multiple explicit sizes */}
          {hasMultipleSizes && (
            <div className="mb-4">
              <h2 className="text-md uppercase font-semibold text-gray-700 mb-2">SIZE</h2>
              <div className="flex space-x-2">
                {sizes.map(size => (
                  <Button
                    key={size}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200
                      ${selectedVariation?.size === size
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-black hover:text-white border-gray-300 hover:border-gray-500'
                      }`}
                    onClick={() => {
                      const newVar = product.variations?.find(v => v.size === size && v.color === selectedVariation?.color) ||
                                     product.variations?.find(v => v.size === size);
                      if (newVar) handleVariationChange(newVar);
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection - Only show if there are multiple colors for the selected size */}
          {hasMultipleColors && (
            <div className="mb-4">
              <h2 className="text-md uppercase font-semibold text-gray-700 mb-2">COLOR</h2>
              <div className="flex space-x-2">
                {colorsForSelectedSize.map(color => (
                  <Button
                    key={color}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200
                      ${selectedVariation?.color === color
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-black hover:text-white border-gray-300 hover:border-gray-500'
                      }`}
                    onClick={() => {
                      const newVar = product.variations?.find(v => v.size === selectedVariation?.size && v.color === color);
                      if (newVar) handleVariationChange(newVar);
                    }}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Always show color if only one variation */}
          {!hasMultipleColors && selectedVariation?.color && (
            <div className="mb-4">
              <h2 className="text-md uppercase font-semibold text-gray-700 mb-2">COLOR</h2>
              <span className="px-4 py-2 border rounded-md text-sm font-medium bg-gray-900 text-white border-gray-900">
                {selectedVariation.color}
              </span>
            </div>
          )}


          <div className="mb-6 text-gray-600 text-sm">
            <p className="mb-1 flex items-center">
              <span className="mr-2">🌍</span> Free worldwide shipping
            </p>
            {isInStock ? (
              <p className={`flex items-center ${isLowStock ? 'text-red-500' : 'text-green-600'}`}>
                <span className="mr-2">{isLowStock ? '⚠️' : '✅'}</span>
                {isLowStock ? `Low stock - ${stockStatus} items left` : 'In stock, ready to ship'}
              </p>
            ) : (
              <p className="flex items-center text-red-500">
                <span className="mr-2">🚫</span> Out of stock
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 mb-6">
            <Button
              className="w-full bg-gray-900 text-white py-5 px-6 rounded-md font-semibold text-lg hover:bg-gray-700 transition-colors duration-300 shadow-md"
              onClick={handleAddToCart}
              disabled={!isInStock} // Disable if out of stock
            >
              ADD TO CART
            </Button>
            <Button
              className="w-full border border-gray-900 text-white  hover:text-black py-5 px-6 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-md"
              onClick={handleBuyNow}
              disabled={!isInStock} // Disable if out of stock
            >
              BUY IT NOW
            </Button>
          </div>

          <p className="text-xs text-gray-500 mb-6">
            This is a demonstration store.
          </p>

          {/* Product Description */}
          <div className="mb-6">
            {/* <h2 className="text-md uppercase font-semibold text-gray-700 mb-2">Description</h2> */}
            <p className="text-gray-700 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>
        </div>

        {/* Shipping Information (Accordion-like, simplified for now) */}
      <ShippingInfo/>
      </div>
    </div>
    </div>
  );
};
export default SingleProductCard;