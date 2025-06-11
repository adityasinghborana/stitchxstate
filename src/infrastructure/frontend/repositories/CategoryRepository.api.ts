import { ICategoryRepository } from "@/core/repositories/ICategoryRepository";
import { ProductCategoryEntity } from "@/core/entities/product.entity";
import { CreateCategoryDTO } from "@/core/dtos/CreateCategory.dto";

export class CategoryApiRepository implements ICategoryRepository{
    async findAll(): Promise<ProductCategoryEntity[]> {
        const response = await fetch('/api/category')
        if(!response.ok){
            const errorData = await  response.json();
            throw new Error(errorData.message || 'failed to fetch category data from api ')
        }
        const data= await response.json();
        return data;
    }

    async create(categoryData: CreateCategoryDTO): Promise<ProductCategoryEntity> {
        const response = await fetch('/api/category',{
            method:'POST',
            headers:{
                'content-Type':'application/json',
            },
            body:JSON.stringify(categoryData)
        });
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create category via API.');
        }
        const data = await response.json();
        return data;
    }
}