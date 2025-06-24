// src/cart/cart.types.ts

// Re-exporting backend DTOs for frontend use
export type { AddToCartDTO, UpdateCartItemDTO, RemoveFromCartDTO, ClearCartDTO } from '@/core/dtos/Cart.dto';

// Re-exporting backend entity for frontend use
import type { CartEntity,CartItemEntity,CartStatus } from '@/core/entities/cart.entity';
export type { CartEntity,CartItemEntity,CartStatus } from '@/core/entities/cart.entity';

// Define Product-related types needed for CartItemEntity on frontend
// Assuming ProductEntity is already defined in your core/entities/product.entity
import { ProductEntity } from '@/core/entities/product.entity';

// Define a minimal ProductVariationEntity for cart items,
// including only necessary fields the frontend uses for display in the cart.
// You might want to extend this based on what you need to show in the cart.
export interface ProductVariationEntityForCart {
    id: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    color?: string | null;
    size?: string | null;
    images: { url: string }[]; // Assuming images are just URLs
    product: ProductEntity; // Full product entity for display details
}

// Extend CartItemEntity to use the frontend-specific ProductVariationEntityForCart
// This helps ensure type safety with the data structure coming from your API
export interface CartItemEntityFrontend extends Omit<CartItemEntity, 'productVariation'> {
    productVariation: ProductVariationEntityForCart;
}

// Extend CartEntity to use the frontend-specific CartItemEntityFrontend
export interface CartEntityFrontend extends Omit<CartEntity, 'items'> {
    items: CartItemEntityFrontend[];
}


// --- Cart Context Types ---
export interface ICartContext {
    cart: CartEntityFrontend | null;
    loading: boolean;
    error: string | null;
    isSidebarOpen: boolean;
    openSidebar: () => void;
    closeSidebar: () => void;
    addToCart: (productVariationId: string, quantity: number) => Promise<void>;
    updateCartItem: (cartItemId: string, newQuantity: number) => Promise<void>;
    removeCartItem: (cartItemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    fetchCart: () => Promise<void>; // Added to manually trigger cart refetch
}