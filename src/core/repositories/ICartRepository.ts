import { CartEntity ,CartItemEntity,CartStatus} from "../entities/cart.entity";
import { AddToCartDTO,UpdateCartItemDTO,RemoveFromCartDTO } from "../dtos/Cart.dto";
import prisma from "@/lib/prisma";

export interface ICartRepository{
    findByUserId(userId:string):Promise<CartEntity | null>;
    create(userId:string):Promise<CartEntity>
    addItem(dto: AddToCartDTO, userId: string): Promise<CartEntity>;
    updateItem(dto: UpdateCartItemDTO): Promise<CartEntity>;
    removeItem(dto: RemoveFromCartDTO): Promise<CartEntity>;
    clearCart(userId: string): Promise<CartEntity>;
    getCartWithItems(userId: string): Promise<CartEntity | null>;
}
export class CartRepository implements ICartRepository {
  async findByUserId(userId: string): Promise<CartEntity | null> {
    const cart = await prisma.cart.findFirst({
      where: { userId, status: CartStatus.ACTIVE },
      include: {
        items: {
          include: {
            productVariation: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return await this.create(userId);
    }

    return this.mapToCartEntity(cart);
  }

  async create(userId: string): Promise<CartEntity> {
    const cart = await prisma.cart.create({
      data: {
        userId,
        status: CartStatus.ACTIVE,
        totalAmount: 0,
        totalItems: 0,
        lastActivity: new Date(),
      },
      include: {
        items: {
          include: {
            productVariation: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    return this.mapToCartEntity(cart);
  }

  async addItem(dto: AddToCartDTO, userId: string): Promise<CartEntity> {
    const { productVariationId, quantity } = dto;

    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const cart = await this.findByUserId(userId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const productVariation = await prisma.productVariation.findUnique({
      where: { id: productVariationId },
      include: { images: true },
    });

    if (!productVariation) {
      throw new Error("Product variation not found");
    }

    if (productVariation.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productVariationId: {
          cartId: cart.id,
          productVariationId,
        },
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: {
          cartId_productVariationId: {
            cartId: cart.id,
            productVariationId,
          },
        },
        data: {
          quantity: existingItem.quantity + quantity,
          price: productVariation.salePrice > 0 ? productVariation.salePrice : productVariation.price,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productVariationId,
          quantity,
          price: productVariation.salePrice > 0 ? productVariation.salePrice : productVariation.price,
        },
      });
    }

    const updatedCart = await this.updateCartTotals(cart.id);

    return updatedCart;
  }

  async updateItem(dto: UpdateCartItemDTO): Promise<CartEntity> {
    const { cartItemId, quantity } = dto;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { productVariation: true },
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    if (quantity <= 0) {
      return this.removeItem({ cartItemId });
    }

    if (cartItem.productVariation.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity,
        price:
          cartItem.productVariation.salePrice > 0
            ? cartItem.productVariation.salePrice
            : cartItem.productVariation.price,
      },
    });

    const updatedCart = await this.updateCartTotals(cartItem.cartId);

    return updatedCart;
  }

  async removeItem(dto: RemoveFromCartDTO): Promise<CartEntity> {
    const { cartItemId } = dto;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    const updatedCart = await this.updateCartTotals(cartItem.cartId);

    return updatedCart;
  }

  async clearCart(userId: string): Promise<CartEntity> {
    const cart = await this.findByUserId(userId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    const updatedCart = await this.updateCartTotals(cart.id);

    return updatedCart;
  }

  async getCartWithItems(userId: string): Promise<CartEntity | null> {
    const cart = await prisma.cart.findFirst({
      where: { userId, status: CartStatus.ACTIVE },
      include: {
        items: {
          include: {
            productVariation: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    return cart ? this.mapToCartEntity(cart) : null;
  }

  private async updateCartTotals(cartId: string): Promise<CartEntity> {
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId },
      include: { productVariation: true },
    });

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const updatedCart = await prisma.cart.update({
      where: { id: cartId },
      data: {
        totalItems,
        totalAmount,
        lastActivity: new Date(),
      },
      include: {
        items: {
          include: {
            productVariation: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    return this.mapToCartEntity(updatedCart);
  }

  private mapToCartEntity(cart: {
    id: string;
    userId: string | null;
    items: {
      id: string;
      cartId: string;
      productVariationId: string;
      quantity: number;
      price: number;
      createdAt: Date;
      updatedAt: Date;
      productVariation: {
        id: string;
        productId: string | null;
        size: string;
        color: string;
        price: number;
        salePrice: number;
        stock: number;
        createdAt: Date;
        updatedAt: Date;
        images: { id: string; url: string; productVariationId: string | null; createdAt: Date }[];
      };
    }[];
    totalAmount: number;
    totalItems: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    lastActivity: Date;
  }): CartEntity {
    return {
      id: cart.id,
      userId: cart.userId ?? undefined,
      items: cart.items.map((item) => ({
        id: item.id,
        cartId: item.cartId,
        productVariationId: item.productVariationId,
        productVariation: {
          id: item.productVariation.id,
          productId: item.productVariation.productId ?? undefined,
          size: item.productVariation.size,
          color: item.productVariation.color,
          price: item.productVariation.price,
          salePrice: item.productVariation.salePrice,
          stock: item.productVariation.stock,
          createdAt: item.productVariation.createdAt,
          updatedAt: item.productVariation.updatedAt,
          images: item.productVariation.images.map((img) => ({
            id: img.id,
            url: img.url,
            productVariationId: img.productVariationId ?? undefined,
            createdAt: img.createdAt,
          })),
        },
        quantity: item.quantity,
        price: item.price,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      totalAmount: cart.totalAmount,
      totalItems: cart.totalItems,
      status: cart.status as CartStatus,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      lastActivity: cart.lastActivity,
    };
  }
}