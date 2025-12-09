import { apiFetch } from './client';
import type { CategoryDto } from 'ssr-blog-shared';

export interface DashboardStats {
  posts: number;
  categories: number;
  tags: number;
  users: number;
}

export interface PermissionData {
  isAdmin: boolean;
  categories: CategoryDto[];
}

export const dashboardApi = {
  async getStats(headers?: HeadersInit) {
    return apiFetch<DashboardStats>('/dashboard/stats', { headers });
  },

  async getPermissions(headers?: HeadersInit) {
    return apiFetch<PermissionData>('/dashboard/permissions', { headers });
  },
};
