
import { CreateCategoryDTO } from "../dtos/CreateCategory.dto";
import { UpdateCategoryDTO } from "../dtos/CreateCategory.dto";
import { CategoryEntity } from "../entities/category.entity";
import prisma from "@/lib/prisma";

export interface ICategoryRepository {
  findAll(): Promise<CategoryEntity[]>;
  findById(id: string): Promise<CategoryEntity | null>;
  create(categoryData: CreateCategoryDTO): Promise<CategoryEntity>;
  update(id: string,categoryData:UpdateCategoryDTO):Promise<CategoryEntity>;
  delete(id: string): Promise<void>;
}
export class CategoryRepository implements ICategoryRepository {
  async findAll(): Promise<CategoryEntity[]> {
    const categories = await prisma.category.findMany({
      include: {
        images: true, // Include category images
      },
    });
    return categories as CategoryEntity[]; // Cast to ensure type compatibility
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        images: true, // Include category images
      },
    });
    return category as CategoryEntity | null;
  }

  async create(categoryData: CreateCategoryDTO): Promise<CategoryEntity> {
    const newCategory = await prisma.category.create({
      data: {
        name: categoryData.name,
        images: {
          create: categoryData.images?.map((image) => ({ url: image.url })) || [],
        },
      },
      include: {
        images: true, // Include the newly created images in the returned entity
      },
    });
    return newCategory as CategoryEntity;
  }

  async update(id: string, categoryData: UpdateCategoryDTO): Promise<CategoryEntity> {
    // If images are provided in the update, we first delete existing images
    // and then create new ones. This is a common strategy for image updates
    // where new images replace old ones.
    if (categoryData.images !== undefined) {
      await prisma.categoryImage.deleteMany({
        where: { categoryId: id },
      });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: categoryData.name,
        images: categoryData.images
          ? {
              create: categoryData.images.map((image) => ({ url: image.url })),
            }
          : undefined, // Only update if images are provided
      },
      include: {
        images: true, // Include updated images
      },
    });
    return updatedCategory as CategoryEntity;
  }

  async delete(id: string): Promise<void> {
    // Prisma's onDelete: Cascade in your schema will handle deleting related images.
    await prisma.category.delete({
      where: { id },
    });
  }
}