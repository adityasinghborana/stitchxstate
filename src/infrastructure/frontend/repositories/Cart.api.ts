// import { ICartRepository } from "@/core/repositories/ICartRepository";
// import { CartEntity } from "@/core/entities/cart.entity";
// import { AddToCartDTO,ClearCartDTO,RemoveFromCartDTO,UpdateCartItemDTO } from "@/core/dtos/Cart.dto";

// export class CartApiRepository implements ICartRepository{

//     private async handleResponse<T>(response: Response): Promise<T> {
//     if (!response.ok) {
//       const error = await response.json().catch(() => ({
//         message: "An error occurred",
//       }));
//       throw new Error(error.message || `HTTP error! status: ${response.status}`);
//     }
//     return response.json();
//   }
//     async findByUserId(userId: string): Promise<CartEntity | null> {
//     const response = await fetch(`/api/cart/${userId}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return this.handleResponse<CartEntity | null>(response);
//   }
//    async create(userId: string): Promise<CartEntity> {
//     const response = await fetch('/api/cart/', {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ userId }),
//     });
//     return this.handleResponse<CartEntity>(response);
//   }

//   async addItem(dto: AddToCartDTO, userId: string): Promise<CartEntity> {
//     const response = await fetch(`/api/cart/${userId}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(dto),
//     });
//     return this.handleResponse<CartEntity>(response);
//   }

//   async updateItem(dto: UpdateCartItemDTO): Promise<CartEntity> {
//     const response = await fetch(`/api/cart/${dto.cartItemId}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(dto),
//     });
//     return this.handleResponse<CartEntity>(response);
//   }

//   async removeItem(dto: RemoveFromCartDTO): Promise<CartEntity> {
//     const response = await fetch(`${this.baseUrl}/items/${dto.cartItemId}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return this.handleResponse<CartEntity>(response);
//   }

//   async clearCart(userId: string): Promise<CartEntity> {
//     const response = await fetch(`${this.baseUrl}/${userId}/clear`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return this.handleResponse<CartEntity>(response);
//   }

//   async getCartWithItems(userId: string): Promise<CartEntity | null> {
//     const response = await fetch(`${this.baseUrl}/${userId}/items`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     retur
// }