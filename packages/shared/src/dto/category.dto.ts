// Category DTOs

export interface CategoryDto {
  id: number;
  name: string;
  slug: string;
  postCount?: number;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
}
