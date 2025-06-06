import { IProductRepository } from "@/core/repositories/IProductRepository";
import { ProductEntity } from "@/core/entities/product.entity";
import { CreateProductDTO } from "@/core/dtos/CreateProduct.dto";

/**
 * ProductApiRepository is the implementation of the IProductRepository interface
 * that communicates with the backend REST API.
 * * It abstracts away all the details of HTTP communication (fetch, headers, body serialization).
 */
export class ProductApiRepository implements IProductRepository {

  /**
   * Fetches all products from the backend API.
   * @returns A promise that resolves to an array of ProductEntity.
   */
  async findAll(): Promise<ProductEntity[]> {
    // Make the GET request to our API endpoint.
    const response = await fetch('/api/products');

    // Check if the request was successful.
    if (!response.ok) {
      // If not, throw an error to be handled by the calling code (e.g., a component or hook).
      throw new Error('Failed to fetch products from the API.');
    }

    // Parse the JSON response from the API.
    const data = await response.json();
    return data;
  }

  /**
   * Creates a new product by sending data to the backend API.
   * @param productData - The data for the new product, conforming to CreateProductDTO.
   * @returns A promise that resolves to the newly created ProductEntity.
   */




  
  async create(productData: CreateProductDTO): Promise<ProductEntity> {
    // Make the POST request to our API endpoint.
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        // This header is crucial to inform the API that we're sending JSON data.
        'Content-Type': 'application/json',
      },
      // Serialize the JavaScript object into a JSON string for the request body.
      body: JSON.stringify(productData),
    });

    // Check if the request was successful (e.g., status 201 Created).
    if (!response.ok) {
      // Try to parse the error message sent back from our API for better feedback.
      const errorData = await response.json();
      throw new Error(errorData.message || 'An unknown error occurred while creating the product.');
    }

    // Parse the JSON response, which should be the newly created product.
    const data = await response.json();
    return data;
  }
}