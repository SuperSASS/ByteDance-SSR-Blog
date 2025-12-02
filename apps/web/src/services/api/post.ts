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
};
