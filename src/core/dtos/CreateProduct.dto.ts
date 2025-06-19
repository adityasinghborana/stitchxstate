// This defines the data structure for creating a new product.
// It's a subset of the main ProductEntity.

export interface CreateProductVariationDTO {
  size: string;
  color: string;
  price: number;
  stock: number;
  salePrice?:number;
  images: { url: string }[];
}

export interface CreateProductDTO {
  name?: string;
  description?: string;
  categoryIds?: string[];
  variations?: CreateProductVariationDTO[] | null;
  thumbnailVideo?: string | null;
  galleryImages?: { url: string }[] | null; 
}