import { apiFetch } from './client';
import type { UserPermissionDto } from 'ssr-blog-shared';

export const permissionApi = {
  async getUserPermissions(
    userId: number,
    headers?: HeadersInit
  ): Promise<UserPermissionDto> {
    return apiFetch<UserPermissionDto>(`/permissions/user/${userId}`, {
      headers,
    });
  },

  async grantPermission(
    userId: number,
    categoryId: number,
    headers?: HeadersInit
  ): Promise<void> {
    return apiFetch<void>('/permissions', {
      method: 'POST',
      body: JSON.stringify({ userId, categoryId }),
      headers,
    });
  },

  async revokePermission(
    userId: number,
    categoryId: number,
    headers?: HeadersInit
  ): Promise<void> {
    return apiFetch<void>(`/permissions/${userId}/${categoryId}`, {
      method: 'DELETE',
      headers,
    });
  },
};
