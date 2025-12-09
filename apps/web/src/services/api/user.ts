import type { UserDto, CreateUserDto, UpdateUserDto } from 'ssr-blog-shared';
import { apiFetch } from './client';

export const userApi = {
  async getUsers(headers?: HeadersInit): Promise<UserDto[]> {
    return apiFetch<UserDto[]>('/users', { headers });
  },

  async getUserById(id: number, headers?: HeadersInit): Promise<UserDto> {
    return apiFetch<UserDto>(`/users/${id}`, { headers });
  },

  async createUser(
    data: CreateUserDto,
    headers?: HeadersInit
  ): Promise<UserDto> {
    return apiFetch<UserDto>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    });
  },

  async updateUser(
    id: number,
    data: UpdateUserDto,
    headers?: HeadersInit
  ): Promise<UserDto> {
    return apiFetch<UserDto>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers,
    });
  },

  async deleteUser(id: number, headers?: HeadersInit): Promise<void> {
    return apiFetch<void>(`/users/${id}`, {
      method: 'DELETE',
      headers,
    });
  },
};
