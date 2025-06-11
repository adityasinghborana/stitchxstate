import { ICategoryRepository } from "../repositories/ICategoryRepository";
import { CreateCategoryDTO } from "../dtos/CreateCategory.dto";
import { CategoryEntity } from "../entities/category.entity";
export class CreateCategoryUseCase{
    constructor(private categoryRepository:ICategoryRepository){}
    async execute(categoryData: CreateCategoryDTO): Promise<CategoryEntity> {
    // Add business validation here (e.g., category name unique)
    const newCategory = await this.categoryRepository.create(categoryData);
    return newCategory;
  }
} 