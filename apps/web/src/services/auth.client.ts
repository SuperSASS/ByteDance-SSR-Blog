import { apiFetch } from './api/client';
import type { LoginDto, AuthResponseDto } from 'ssr-blog-shared';

/**
 * 客户端登录
 * @param data 登录信息
 * @returns 用户信息
 */
export async function login(data: LoginDto): Promise<AuthResponseDto['user']> {
  const response = await apiFetch<AuthResponseDto>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.user;
}

/**
 * 退出登录
 */
export async function logout(): Promise<void> {
  await apiFetch('/auth/logout', { method: 'POST' });
}

/**
 * 获取当前用户信息
 */
export async function me(): Promise<AuthResponseDto['user']> {
  const response = await apiFetch<AuthResponseDto>('/auth/me', {
    method: 'GET',
  });
  return response.user;
}
