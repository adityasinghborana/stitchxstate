// src/infrastructure/backend/repositories/CategoryRepository.ts
import { CreateCategoryDTO } from "../dtos/CreateCategory.dto";
import { UpdateCategoryDTO } from "../dtos/CreateCategory.dto";
import { CategoryEntity } from "../entities/category.entity";
import prisma from "@/lib/prisma"; 

// --- Interface Update ---
// The interface should also reflect the new data structure
export interface ICategoryRepository {
  findAll(): Promise<CategoryEntity[]>;
  findById(id: string): Promise<CategoryEntity | null>;
  create(categoryData: CreateCategoryDTO): Promise<CategoryEntity>;
  update(id: string, categoryData: UpdateCategoryDTO): Promise<CategoryEntity>;
  delete(id: string): Promise<void>;
}

export class CategoryRepository implements ICategoryRepository {
  async findAll(): Promise<CategoryEntity[]> {
    const categories = await prisma.category.findMany({
      // REMOVED: include: { images: true } because images are no longer a related model
    });
    // Prisma now directly returns CategoryEntity shape (with imageUrl)
    return categories as CategoryEntity[];
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    return category as CategoryEntity | null;
  }

  async create(categoryData: CreateCategoryDTO): Promise<CategoryEntity> {
    const newCategory = await prisma.category.create({
      data: {
        name: categoryData.name,
        imageUrl: categoryData.imageUrl, 
      },
    });
    return newCategory as CategoryEntity;
  }

  async update(id: string, categoryData: UpdateCategoryDTO): Promise<CategoryEntity> {

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        // Only update name if it's provided in the DTO
        name: categoryData.name !== undefined ? categoryData.name : undefined,
        // Only update imageUrl if it's provided in the DTO
        imageUrl: categoryData.imageUrl !== undefined ? categoryData.imageUrl : undefined,
      },
    });
    return updatedCategory as CategoryEntity;
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }
}