import type { TagDto } from 'ssr-blog-shared';
import { apiFetch } from './client';

export const tagApi = {
  async getTags(): Promise<TagDto[]> {
    return apiFetch<TagDto[]>('/tags');
  },

  async getTagById(id: number): Promise<TagDto> {
    return apiFetch<TagDto>(`/tags/${id}`);
  },

  // Admin methods
  async createTag(
    data: { name: string; slug: string },
    headers?: HeadersInit
  ): Promise<TagDto> {
    return apiFetch<TagDto>('/tags', {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    });
  },

  async updateTag(
    id: number,
    data: { name?: string; slug?: string },
    headers?: HeadersInit
  ): Promise<TagDto> {
    return apiFetch<TagDto>(`/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers,
    });
  },

  async deleteTag(id: number, headers?: HeadersInit): Promise<void> {
    return apiFetch<void>(`/tags/${id}`, {
      method: 'DELETE',
      headers,
    });
  },
};
