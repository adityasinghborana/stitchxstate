import { ICategoryRepository } from "../repositories/ICategoryRepository";
import { CreateCategoryDTO } from "../dtos/CreateCategory.dto";
import { CategoryEntity } from "../entities/category.entity";

export class UpdateCategoryUseCase{
    constructor(private categoryRepository:ICategoryRepository){}
    async execute(id:string,categoryData:CreateCategoryDTO):Promise<CategoryEntity>{
         if (Object.keys(categoryData).length === 0) {
        throw { message: 'No data provided for category update.', code: 'NO_UPDATE_DATA' };
        }
        try {
            const existingCategory = await this.categoryRepository.findById(id);
            if (!existingCategory) {
                throw { message: 'Category not found for update.', code: 'NOT_FOUND' };
            }
            const updatedCategory = await this.categoryRepository.update(id,categoryData);
            return updatedCategory;
        } catch (error) {
            console.error(`Error in CategoryUseCases.updateCategory for ID ${id}:`, error);
            throw error;
        }
    }
}