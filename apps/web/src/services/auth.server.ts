/**
 * 服务端/SSR 鉴权工具
 * - 只能依赖 HTTP Request（headers、cookie）
 * - 典型使用场景：React Router loader 中，进行登录认证
 */

import { redirect } from 'react-router-dom';
import { apiFetch } from './api/client';
import type { AuthResponseDto } from 'ssr-blog-shared';

/**
 * 服务器环境中，从 HTTP Request 中获取用户信息
 *
 * @param request HTTP Request
 * @returns 用户信息，或 null（未登录）
 */
export async function getUserFromRequest(
  request: Request
): Promise<AuthResponseDto['user'] | null> {
  // 目前是手动加的 cookie
  const cookie = request.headers.get('cookie') ?? '';

  try {
    const result = await apiFetch<AuthResponseDto>('/auth/me', {
      headers: { cookie },
    });
    return result.user;
  } catch (_) {
    // 未登录
    return null;
  }
}

/**
 * 服务器环境中，在 loader/action 中使用的「强制需要登录」方法
 * - 未登录则重定向到 /admin/login
 * - 已登录则返回用户信息
 *
 * @param request HTTP Request
 * @returns 用户信息
 * @throws 未登录时，重定向到 /admin/login
 */
export async function requireAuth(
  request: Request
): Promise<AuthResponseDto['user']> {
  const user = await getUserFromRequest(request);

  if (!user) {
    throw redirect('/admin/login');
  }

  return user;
}
