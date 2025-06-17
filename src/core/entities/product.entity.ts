
import { CategoryEntity } from "./category.entity";
export interface ProductImageEntity {
  id: string;
  url: string;
}

export interface ProductCategoryEntity {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface ProductVariationEntity {
  id: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  images: ProductImageEntity[];
}

export interface ProductEntity {
  id: string;
  name: string;
  description: string;
  variations: ProductVariationEntity[];
  categories: CategoryEntity[];
}