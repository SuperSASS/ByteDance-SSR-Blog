import type { CategoryDto } from 'ssr-blog-shared';
import { apiFetch } from './client';

export const categoryApi = {
  async getCategories(): Promise<CategoryDto[]> {
    return apiFetch<CategoryDto[]>('/categories');
  },

  async getCategoryById(id: number): Promise<CategoryDto> {
    return apiFetch<CategoryDto>(`/categories/${id}`);
  },

  // Admin methods
  async createCategory(
    data: { name: string; slug: string },
    headers?: HeadersInit
  ): Promise<CategoryDto> {
    return apiFetch<CategoryDto>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    });
  },

  async updateCategory(
    id: number,
    data: { name?: string; slug?: string },
    headers?: HeadersInit
  ): Promise<CategoryDto> {
    return apiFetch<CategoryDto>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers,
    });
  },

  async deleteCategory(id: number, headers?: HeadersInit): Promise<void> {
    return apiFetch<void>(`/categories/${id}`, {
      method: 'DELETE',
      headers,
    });
  },
};
