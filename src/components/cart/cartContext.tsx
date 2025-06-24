// 'use client'; // This is a client-side context

// import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// import { CartEntity } from '@/core/entities/cart.entity';
// import { AddToCartDTO } from './cart.types';
// import { CartApiRepository } from '@/infrastructure/frontend/repositories/Cart.api';

// // Define the shape of our context
// interface CartContextType {
//     cart: CartEntity | null;
//     isCartOpen: boolean;
//     isLoading: boolean;
//     error: string | null;
//     addToCart: (item: AddToCartDTO) => Promise<void>;
//     openCart: () => void;
//     closeCart: () => void;
//     // You can add updateItem, removeItem etc. here later
// }

// // Create the context with a default value
// const CartContext = createContext<CartContextType | undefined>(undefined);

// // Instantiate our repository
// const cartRepository = new CartApiRepository();

// // Create the Provider component
// export const CartProvider = ({ children }: { children: ReactNode }) => {
//     const [cart, setCart] = useState<CartEntity | null>(null);
//     const [isCartOpen, setIsCartOpen] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     // Fetch the cart when the provider first loads
//     useEffect(() => {
//         const fetchInitialCart = async () => {
//             setIsLoading(true);
//             try {
//                 const initialCart = await cartRepository.getCart();
//                 setCart(initialCart);
//             } catch (err: any) {
//                 // It's okay if it fails (e.g., 404 if no cart exists yet)
//                 console.log(err.message);
//                 setCart(null);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchInitialCart();
//     }, []);

//     const handleAddToCart = async (item: AddToCartDTO) => {
//         setIsLoading(true);
//         setError(null);
//         try {
//             const updatedCart = await cartRepository.addToCart(item);
//             setCart(updatedCart);
//             setIsCartOpen(true); // Open the cart to show the user what happened
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const value: CartContextType = {
//         cart,
//         isCartOpen,
//         isLoading,
//         error,
//         addToCart: handleAddToCart,
//         openCart: () => setIsCartOpen(true),
//         closeCart: () => setIsCartOpen(false),
//     };

//     return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// // Create a custom hook for easy access to the context
// export const useCart = () => {
//     const context = useContext(CartContext);
//     if (context === undefined) {
//         throw new Error('useCart must be used within a CartProvider');
//     }
//     return context;
// };