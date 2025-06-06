// NO 'use client' here. This is a Server Component.
import { CreateProductForm } from './(components)/CreateProductForm';
import { ProductList } from './(components)/ProductList';

import { GetAllProductsUseCase } from '@/core/usecases/GetAllProducts.usecase';
import { ProductRepository } from '@/core/repositories/IProductRepository'; // <-- IMPORTANT

// The Page component is now async
export default async function ProductsPage() {
  
  // --- SERVER-SIDE DATA FETCHING ---
  // We instantiate the PRISMA repository directly. No API call needed.
  const productRepository = new ProductRepository();
  const getAllProducts = new GetAllProductsUseCase(productRepository);
  
  // Fetch the data on the server before rendering the page.
  const initialProducts = await getAllProducts.execute();
  // --- END SERVER-SIDE DATA FETCHING ---

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-extrabold mb-8">Product Management</h1>
      
      {/* The form for creating products remains a client component */}
      <CreateProductForm />
      
      {/* We pass the server-fetched data down to the list component as a prop */}
      <ProductList initialProducts={initialProducts} />
      
    </main>
  );
}