import type { PostSummaryDto, PostDetailDto } from 'ssr-blog-shared';
import { apiFetch } from './client';

export const postApi = {
  async getPublishedPosts(): Promise<PostSummaryDto[]> {
    return apiFetch<PostSummaryDto[]>('/posts?published=true');
  },

  async getPostById(id: number): Promise<PostDetailDto> {
    return apiFetch<PostDetailDto>(`/posts/${id}`);
  },

  async getPostsByCategory(categoryId: number): Promise<PostSummaryDto[]> {
    return apiFetch<PostSummaryDto[]>(`/posts/category/${categoryId}`);
  },

  async getPostsByTag(tagId: number): Promise<PostSummaryDto[]> {
    return apiFetch<PostSummaryDto[]>(`/posts/tag/${tagId}`);
  },

  async getPostsByYear(year: number): Promise<PostSummaryDto[]> {
    return apiFetch<PostSummaryDto[]>(`/posts/year/${year}`);
  },

  async getArchiveStatistics(): Promise<{ year: number; count: number }[]> {
    return apiFetch<{ year: number; count: number }[]>('/archive/statistics');
  },

  // Admin methods
  async getAdminPosts(
    params?: { page?: number; limit?: number },
    headers?: HeadersInit
  ): Promise<PostSummaryDto[]> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    return apiFetch<PostSummaryDto[]>(`/admin/posts?${query.toString()}`, {
      headers,
    });
  },

  async createPost(data: any, headers?: HeadersInit): Promise<PostDetailDto> {
    return apiFetch<PostDetailDto>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    });
  },

  async updatePost(
    id: number,
    data: any,
    headers?: HeadersInit
  ): Promise<PostDetailDto> {
    return apiFetch<PostDetailDto>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers,
    });
  },

  async deletePost(id: number, headers?: HeadersInit): Promise<void> {
    return apiFetch<void>(`/posts/${id}`, {
      method: 'DELETE',
      headers,
    });
  },
};
