// export interface CreateCategoryDTO {
//   name: string;
//   images?: { url: string }[]; 
// }
// export interface UpdateCategoryDTO {
//   name?: string;
//   images?: { url: string }[]; // Images to be updated/replaced or added
//   // Add other fields if needed, e.g., parentCategoryId
// }

export interface CreateCategoryDTO {
  name: string;
  imageUrl?: string; 
}

export interface UpdateCategoryDTO {
  name?: string;      
  imageUrl?: string |null;  
}