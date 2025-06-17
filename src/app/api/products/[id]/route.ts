import { NextResponse } from "next/server";
import { ProductRepository } from "@/core/repositories/IProductRepository";
import { getProductByIdUSeCase } from "@/core/usecases/GetProductById.usecase";
import { UpdateProductUseCase } from "@/core/usecases/UpdateProduct.usecase";
import { deleteProductUsecase } from "@/core/usecases/DeleteProduct.usecase";
import { CreateProductDTO } from "@/core/dtos/CreateProduct.dto";

const productRepository =new ProductRepository;
const GetProductByIdUsecase=new getProductByIdUSeCase(productRepository);
const updateProductUSeCase = new UpdateProductUseCase(productRepository);
const DeleteProductUseCase = new deleteProductUsecase(productRepository);

export async function GET(
    request:Request,
    {params}:{params:Promise<{id:string}>}
){
    try {
        const {id} = await params;
        if(!id){
            return NextResponse.json({message:'missing user id in request'},{status:400});
        }
        const category= await GetProductByIdUsecase.execute(id);
        if(!category){
            return NextResponse.json({message:"Product not found"},{status:404});
        }
        return NextResponse.json(category,{status:200})
    } catch (error:any) {
        console.error('error fetching by product by id:',error);
        return NextResponse.json({message:"failed to fetch user",error:error.message},{status:500});
    }
}

export async function PUT(
    request:Request,{params}:{ params: { id: string } }
){
    try {
        const {id} =params;
        if(!id){
            return NextResponse.json({message:'missing user id in request'},{status:400});
        }
        const body:CreateProductDTO = await request.json();
        const updatedProduct = await updateProductUSeCase.execute(id, body);
        if (!updatedProduct) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 }); // Corrected message
        }
         return NextResponse.json(updatedProduct, { status: 200 });
    } catch(error:any){
        console.error('error updating user ',error);
        return NextResponse.json({message:'Failed  to update user ',error:error.message},{status:500});
    }
}

export async function DELETE(
    request:Request,
    {params}:{params:Promise<{id:string}>}
){
    try {
        const {id} = await params;
        if (!id) {
            return NextResponse.json({ message: 'Missing user id in request' }, { status: 400 });
        }
        const deleteCategory = DeleteProductUseCase.execute(id);
        if (!deleteCategory) {
            return NextResponse.json({ message: 'product  not found' }, { status: 404 });
        }
        return NextResponse.json({message:"product deleted successfully"},{status:200});
    } catch (error:any) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ message: 'Failed to delete user', error: error.message }, { status: 500 });
    }
}