import { CategoryRepository } from '@/core/repositories/ICategoryRepository';
import { getCategoryByIdUSeCase } from '@/core/usecases/GetCategoryById.usecase';
import { CategoryEditForm } from '../../(_components)/editCategoryForm';
import { notFound } from 'next/navigation'; 

interface CategoryEditPageProps {
  params: {
    categoriesId: string; 
  };
}

export default async function CategoryEditPage({ params }: CategoryEditPageProps) {
  const { categoriesId } = await params; 
  const categoryIdToUse = categoriesId;
  const categoryRepository = new CategoryRepository();
  const getCategoryByIdUseCase = new getCategoryByIdUSeCase(categoryRepository);

  let initialCategory;
  try {
    initialCategory = await getCategoryByIdUseCase.execute(categoryIdToUse);
  } catch (error) {
    console.error(`Error fetching category with ID ${categoryIdToUse} for edit:`, error);
   
  }

  if (!initialCategory) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Category: {initialCategory.name}</h1>
      {/* Pass the fetched initialCategory data and the categoryId to your Client Component */}
      <CategoryEditForm initialCategory={initialCategory} categoryId={categoryIdToUse} />
    </div>
  );
}