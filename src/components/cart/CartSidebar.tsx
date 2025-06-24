// 'use client';
// import { useCart } from "./cartContext";
// // import styles from './CartSidebar.module.css'; // No longer needed

// export const CartSidebar = () => {
//     const { cart, isCartOpen, closeCart, isLoading, error } = useCart(); // Added 'error' from context

//     return (
//         <>
//             {/* Overlay */}
//             <div
//                 className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
//                 onClick={closeCart}
//             />
//             {/* Sidebar */}
//             <div className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//                 <div className="flex justify-between items-center p-4 border-b border-gray-200">
//                     <h3 className="text-xl font-semibold">Your Cart</h3>
//                     <button onClick={closeCart} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">
//                         &times;
//                     </button>
//                 </div>

//                 <div className="flex-grow p-4 overflow-y-auto">
//                     {isLoading && !cart && <p className="text-gray-600">Loading...</p>}
//                     {error && <p className="text-red-500">Error: {error}</p>} {/* Error display */}
//                     {!isLoading && (!cart || cart.items.length === 0) && (
//                         <p className="text-gray-600">Your cart is empty.</p>
//                     )}

//                     {cart && cart.items.length > 0 && (
//                         <ul className="list-none p-0 m-0">
//                             {cart.items.map(item => (
//                                 <li key={item.productId} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
//                                     <span className="font-medium text-gray-800">{item.product.name}</span>
//                                     <span className="text-gray-600">Qty: {item.quantity}</span>
//                                     <span className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>

//                 {cart && cart.items.length > 0 && (
//                     <div className="p-4 border-t border-gray-200">
//                         <div className="flex justify-between font-bold text-lg mb-4">
//                             <span>Total:</span>
//                             <span>${cart.totalAmount.toFixed(2)}</span>
//                         </div>
//                         <button className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200">
//                             Proceed to Checkout
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// };