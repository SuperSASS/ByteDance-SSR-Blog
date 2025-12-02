import type { CategoryDto } from 'ssr-blog-shared';
import { apiFetch } from './client';

export const categoryApi = {
  async getCategories(): Promise<CategoryDto[]> {
    return apiFetch<CategoryDto[]>('/categories');
  },

  async getCategoryById(id: number): Promise<CategoryDto> {
    return apiFetch<CategoryDto>(`/categories/${id}`);
  },
};
