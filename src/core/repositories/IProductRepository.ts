import { CreateProductDTO } from "../dtos/CreateProduct.dto";
import { ProductEntity } from "../entities/product.entity";
import prisma from "@/lib/prisma";
// This is the contract our use case will depend on.
// It dictates the methods that any product repository must implement.
export interface IProductRepository {
  findAll(): Promise<ProductEntity[]>;
  create(productData: CreateProductDTO): Promise<ProductEntity>;
  // You could add other methods here later, like:
  // findById(id: string): Promise<ProductEntity | null>;
  // create(product: ProductEntity): Promise<ProductEntity>;
}

export class ProductRepository implements IProductRepository {
  
  // The method from our interface is implemented here using Prisma.
  async findAll(): Promise<ProductEntity[]> {
    const products = await prisma.product.findMany({
      include: {
        variations: {
          include: {
            images: true,
          },
        },
        categories: true,
      },
    });

    // The data structure from Prisma happens to match our ProductEntity perfectly.
    // If it didn't, you would map the Prisma model to your entity here.
    return products;
  } 

  
  async create(productData: CreateProductDTO): Promise<ProductEntity> {
    const { name, description, categoryIds, variations } = productData;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        // Connect to existing categories using their IDs
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
        // Create the nested variations and their images
        variations: {
          create: variations.map(variation => ({
            size: variation.size,
            color: variation.color,
            price: variation.price,
            stock: variation.stock,
            images: {
              create: variation.images.map(image => ({ url: image.url })),
            },
          })),
        },
      },
      // Include the relations in the returned object to match ProductEntity
      include: {
        variations: {
          include: {
            images: true,
          },
        },
        categories: true,
      },
    });

    return newProduct;
  }
}