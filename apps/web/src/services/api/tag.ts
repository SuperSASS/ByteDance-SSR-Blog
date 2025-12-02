import type { TagDto } from 'ssr-blog-shared';
import { apiFetch } from './client';

export const tagApi = {
  async getTags(): Promise<TagDto[]> {
    return apiFetch<TagDto[]>('/tags');
  },

  async getTagById(id: number): Promise<TagDto> {
    return apiFetch<TagDto>(`/tags/${id}`);
  },
};
