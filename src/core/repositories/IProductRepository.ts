import { CreateProductDTO } from "../dtos/CreateProduct.dto";
import { ProductEntity } from "../entities/product.entity";
import prisma from "@/lib/prisma";
// This is the contract our use case will depend on.
// It dictates the methods that any product repository must implement.
export interface IProductRepository {
  findAll(): Promise<ProductEntity[]>;
  create(productData: CreateProductDTO): Promise<ProductEntity>;
  findById(id:string):Promise<ProductEntity |null>;
  update(id: string, productData: CreateProductDTO): Promise<ProductEntity>;
  delete(id: string): Promise<ProductEntity>;
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

async findById(id: string): Promise<ProductEntity | null> {
    const product = await prisma.product.findUnique({
        where: { id },
      
    });
    console.log(`ProductRepository.findById result for ${id}:`, product ? 'Found' : 'Not Found', product);
    return product as ProductEntity |null;
}
  
  async create(productData: CreateProductDTO): Promise<ProductEntity> {
    const { name, description, categoryIds, variations } = productData;
    const createData: any = { 
        name,
        description,
    };
    if (categoryIds && categoryIds.length > 0) { // Check if categoryIds exists AND is not empty
        createData.categories = {
            connect: categoryIds.map((id) => ({ id })),
        };
    }
    if (variations && variations.length > 0) { // Check if variations exists AND is not empty
        createData.variations = {
            create: variations.map(variation => ({
                size: variation.size,
                color: variation.color,
                price: variation.price,
                stock: variation.stock,
                // images part needs to be conditional too if images can be empty
                images: {
                  create: (variation.images || []).map(image => ({ url: image.url })),
                },
            })),
        };
    }
    const newProduct = await prisma.product.create({
        data: createData, // Use the conditionally built createData
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
 async update(id: string, productData: CreateProductDTO): Promise<ProductEntity> {
    const { name, description, categoryIds, variations } = productData;
    const updateData: any = {}; // Use 'any' for now, or define a specific type for partial updates
    if (name !== undefined) { // Check if name is explicitly provided
        updateData.name = name;
    }
    if (description !== undefined) { // Check if description is explicitly provided
        updateData.description = description;
    }

    // Only include 'categories.set' if 'categoryIds' is provided
    if (categoryIds !== undefined) {
        updateData.categories = {
            set: categoryIds.map((catId) => ({ id: catId })),
        };
    }
    await prisma.product.update({
        where: { id },
        data:updateData,
        include: {
            variations: {
                include: { images: true },
            },
            categories: true,
        },
    });

    //  If variations are provided, delete old and create new ones
    if (variations && variations.length > 0) {
        // Delete all variations and their images (because of onDelete: Cascade)
        await prisma.productVariation.deleteMany({
            where: { productId: id },
        });

        // Create new variations
        for (const variation of variations) {
            await prisma.productVariation.create({
                data: {
                    size: variation.size,
                    color: variation.color,
                    price: variation.price,
                    stock: variation.stock,
                    product: { connect: { id } },
                    images: {
                        create: variation.images.map((img) => ({ url: img.url })),
                    },
                },
            });
        }
    }

    // 3. Return updated product with fresh relations
    const finalProduct = await prisma.product.findUnique({
        where: { id },
        include: {
            variations: {
                include: {
                    images: true,
                },
            },
            categories: true,
        },
    });

    return finalProduct!; // The '!' asserts it's not null, which should be true if the update succeeded and the product exists.
}
async delete(id: string): Promise<ProductEntity> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variations: {
        include: {
          images: true,
        },
      },
      categories: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  await prisma.product.delete({
    where: { id },
  });

  return product;
}

}