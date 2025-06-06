// This defines the data structure for creating a new product.
// It's a subset of the main ProductEntity.

interface CreateProductVariationDTO {
  size: string;
  color: string;
  price: number;
  stock: number;
  images: { url: string }[];
}

export interface CreateProductDTO {
  name: string;
  description: string;
  // We expect category IDs to be provided for linking
  categoryIds: string[]; 
  variations: CreateProductVariationDTO[];
}