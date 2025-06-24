// core/repositories/ProductRepository.ts
import { CreateProductDTO } from "../dtos/CreateProduct.dto";
import { ProductEntity } from "../entities/product.entity";
import prisma from "@/lib/prisma";

export interface IProductRepository {
  findAll(): Promise<ProductEntity[]>;
  create(productData: CreateProductDTO): Promise<ProductEntity>;
  findById(id:string):Promise<ProductEntity |null>;
  update(id: string, productData: CreateProductDTO): Promise<ProductEntity>;
  delete(id: string): Promise<ProductEntity>;
  findByCategoryId(categoryId: string): Promise<ProductEntity[]>;
}

export class ProductRepository implements IProductRepository {
  
  async findAll(): Promise<ProductEntity[]> {
    const products = await prisma.product.findMany({
      include: {
        variations: {
          include: {
            images: true,
          },
        },
        categories: true,
        galleryImages: true, // Correctly included
      },
    });
    return products as ProductEntity[];
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { 
        variations: {
          include: {
            images: true,
          },
        },
        categories: true,
        galleryImages: true, // Correctly included
      },
    });
    console.log(`ProductRepository.findById result for ${id}:`, product ? 'Found' : 'Not Found', product);
    return product as ProductEntity | null;
  }

  async findByCategoryId(categoryId: string): Promise<ProductEntity[]> {
    const products = await prisma.product.findMany({
      where: {
        categories: {
          some: {
            id: categoryId,
          },
        },
      },
      include: { 
        categories: true,
        variations: {
          include: {
            images: true,
          },
        },
        galleryImages: true, 
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });
    return products as ProductEntity[];
  }

  async create(productData: CreateProductDTO): Promise<ProductEntity> {
    // Destructure all new fields
    const { name, description, categoryIds, variations, thumbnailVideo, galleryImages } = productData;
    
    const createData: any = { // Consider using Prisma.ProductCreateInput for better type safety
        name,
        description,
        ...(thumbnailVideo !== undefined && thumbnailVideo !== null && { thumbnailVideo }), // Handle null for thumbnailVideo
    };

    if (categoryIds && categoryIds.length > 0) {
        createData.categories = {
            connect: categoryIds.map((id) => ({ id })),
        };
    }

    if (variations && variations.length > 0) {
        createData.variations = {
            create: variations.map(variation => ({
                size: variation.size,
                color: variation.color,
                price: variation.price,
                stock: variation.stock,
                salePrice: variation.salePrice ?? 0.0,
                images: {
                    create: (variation.images || []).map(image => ({ url: image.url })),
                },
            })),
        };
    }

    if (galleryImages && galleryImages.length > 0) {
        createData.galleryImages = {
            create: galleryImages.map(image => ({ url: image.url })),
        };
    }

    const newProduct = await prisma.product.create({
        data: createData,
        include: {
            variations: {
                include: {
                    images: true,
                },
            },
            categories: true,
            galleryImages: true, // Ensured galleryImages is included
        },
    });

    return newProduct;
  }

   async update(id: string, productData: CreateProductDTO): Promise<ProductEntity> {
    const { name, description, categoryIds, variations, thumbnailVideo, galleryImages } = productData;
    const updateData: any = {}; // Consider using Prisma.ProductUpdateInput for better type safety

    if (name !== undefined) {
        updateData.name = name;
    }
    if (description !== undefined) {
        updateData.description = description;
    }
    // Update thumbnailVideo: if provided, set it. If explicitly null, set to null.
    if (thumbnailVideo !== undefined) {
      updateData.thumbnailVideo = thumbnailVideo;
    }

    if (categoryIds !== undefined) {
        updateData.categories = {
            set: categoryIds.map((catId) => ({ id: catId })),
        };
    }

    await prisma.product.update({
        where: { id },
        data: updateData,
    });

    if (variations !== undefined) {
        await prisma.productVariation.deleteMany({
            where: { productId: id },
        });

        if (variations !== null && variations.length > 0) { // <-- Explicitly check for null here
            for (const variation of variations) {
                await prisma.productVariation.create({
                    data: {
                        size: variation.size,
                        color: variation.color,
                        price: variation.price,
                        stock: variation.stock,
                        salePrice: variation.salePrice ?? 0.0,
                        product: { connect: { id } },
                        images: {
                            // (variation.images || []) ensures it's an array for map
                            create: (variation.images || []).map((img) => ({ url: img.url })),
                        },
                    },
                });
            }
        }
    }

    if (galleryImages !== undefined) {
        await prisma.galleryImage.deleteMany({
            where: { productId: id },
        });

        if (galleryImages !== null && galleryImages.length > 0) { 
            for (const image of galleryImages) {
                await prisma.galleryImage.create({
                    data: {
                        url: image.url,
                        product: { connect: { id } },
                    },
                });
            }
        }
    }

    const finalProduct = await prisma.product.findUnique({
        where: { id },
        include: {
            variations: {
                include: {
                    images: true,
                },
            },
            categories: true,
            galleryImages: true,
        },
    });

    return finalProduct!;
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
        galleryImages: true,
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