import { CategoryEntity } from "@/core/entities/category.entity";
import { CategoryRepository } from "@/core/repositories/ICategoryRepository";
import { GetAllCategoriesUseCase } from "@/core/usecases/GetAllCategory.usecase";
import CategoryListForm from "./(component)/CategoryListForm";
export default async function CategoryListPage(){
    const categoryRepository = new CategoryRepository();
    const getAllcategoriesUseCase = new GetAllCategoriesUseCase(categoryRepository);
    let categories:CategoryEntity[]=[];
    let error:string |null;
    try {
        categories=await getAllcategoriesUseCase.execute();
    } catch (err:any) {
        console.error("Error fetching categories:", err); 
        error = err.message || 'Failed to load categories.';
    }

    return(
        <div className="text-center mt-10">
            <div className="text-6xl font-bold mb-10">SHOP BY CATEGORY</div>
            <CategoryListForm categories={categories}/>
        </div>    

    )
}