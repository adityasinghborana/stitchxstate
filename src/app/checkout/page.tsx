// // app/checkout/page.tsx
// 'use client';

// import React, { useState, useEffect, useMemo } from 'react';
// import { useCartStore } from '@/components/cart/cartHooks'; // Use Zustand store
// import { useRouter, useSearchParams } from 'next/navigation';
// import CheckoutForm from '@/components/checkout/CheckoutForm';
// import OrderSummary from '@/components/checkout/OrderSummary';
// import { CheckoutPayload } from '@/core/entities/checkout.entity';
// import { CartEntity } from '@/core/entities/cart.entity';
// import { CartApiRepository } from '@/infrastructure/frontend/api/CartApiRepository';
// import { OrderApiRepository } from '@/infrastructure/frontend/api/OrderApiRepository';

// const CheckoutPage: React.FC = () => {
//     // We'll use Zustand's cart state directly for cart-based checkout
//     const cart = useCartStore((state) => state.cart);
//     const cartLoading = useCartStore((state) => state.loading);
//     const cartError = useCartStore((state) => state.error);
//     const clearCart = useCartStore((state) => state.clearCart);
//     const fetchCart = useCartStore((state) => state.getCart); // Renamed getCart to fetchCart in Zustand store

//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const cartIdFromUrl = searchParams.get('cartId'); // Expecting cartId from URL for cart-based checkout

//     const [isProcessing, setIsProcessing] = useState(false);
//     const [checkoutError, setCheckoutError] = useState<string | null>(null);

//     const orderApi = useMemo(() => new OrderApiRepository(), []);

//     // Effect to ensure cart data is loaded when page mounts
//     useEffect(() => {
//         // If cart data is not yet loaded, or if the URL has a cartId, fetch it.
//         // This ensures the cart is fresh when entering checkout.
//         if (!cart && !cartLoading && cartIdFromUrl) {
//             fetchCart(); // Fetch the cart using the Zustand action
//         }
//     }, [cart, cartLoading, cartIdFromUrl, fetchCart]);

//     const handleFormSubmit = async (formData: Omit<CheckoutPayload, 'cartId'>) => {
//         if (!cart || cart.items.length === 0) {
//             setCheckoutError('Your cart is empty. Please add items before checking out.');
//             return;
//         }

//         setIsProcessing(true);
//         setCheckoutError(null);

//         try {
//             const payload: CheckoutPayload = {
//                 cartId: cart.id, // Use the cart ID from the Zustand store
//                 ...formData,
//             };

//             // Call the OrderApiRepository to process the checkout
//             const result = await orderApi.processCheckout(payload);

//             console.log('Order created successfully:', result);

//             // Clear the cart from the Zustand store and re-fetch to confirm it's empty
//             clearCart();
//             fetchCart();

//             // Redirect to the confirmation page
//             router.push(`/order-confirmation?orderId=${result.orderId}`);

//         } catch (err: any) {
//             console.error('Checkout error:', err);
//             setCheckoutError(err.message || 'Failed to complete order.');
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     // Use cart from Zustand store for display and checks
//     if (cartLoading) {
//         return <div className="text-center py-10 text-xl text-gray-600">Loading cart for checkout...</div>;
//     }

//     if (cartError) {
//         return <div className="text-center py-10 text-xl text-red-500">Error loading cart: {cartError}</div>;
//     }

//     // If no cart or empty cart, show message
//     if (!cart || cart.items.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center py-20 min-h-[60vh] bg-gray-50 rounded-lg shadow-md m-4">
//                 <p className="text-xl text-gray-600 mb-4">Your cart is empty. Please add items to proceed.</p>
//                 <button
//                     onClick={() => router.push('/')}
//                     className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-900 transition-colors duration-300"
//                 >
//                     Continue Shopping
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 font-inter">
//             {/* Left side: Checkout Form */}
//             <div className="lg:order-1 order-2">
//                 <h1 className="text-3xl font-bold mb-6 text-gray-900">Checkout</h1>
//                 <CheckoutForm
//                     onSubmit={handleFormSubmit}
//                     isProcessing={isProcessing}
//                     checkoutError={checkoutError}
//                 />
//             </div>
//             {/* Right side: Order Summary */}
//             <div className="lg:order-2 order-1">
//                 {/* Always pass the cart from Zustand store */}
//                 <OrderSummary cart={cart} />
//             </div>
//         </div>
//     );
// };

// export default CheckoutPage;