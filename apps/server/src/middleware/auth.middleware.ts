import type Koa from 'koa';
import koaJwt from 'koa-jwt';
import { prisma } from '../db/prisma.js';
import { postService } from '../services/post.service.js';

/**
 * JWT 认证中间件
 *
 * Token 将优先从 cookie 中获取，如果不存在则从 Authorization 头中获取
 * 解析后的 payload 将放入 ctx.state.user
 */
export const requireAuth = koaJwt({
  secret: process.env.JWT_SECRET!,
  key: 'user', // 将解析后的 payload 放入 ctx.state.user

  getToken: (ctx) => {
    // 优先从 cookie 拿
    const fromCookie = ctx.cookies.get('auth_token');
    if (fromCookie) return fromCookie;

    // 或者支持 Authorization: Bearer xxx
    const authHeader = ctx.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    return null;
  },
});

/**
 * 角色权限中间件
 * @param roles 允许的角色列表
 * @returns Koa 中间件
 */
export function requireRole(...roles: string[]) {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    const user = ctx.state.user;

    if (!user || !roles.includes(user.role)) {
      ctx.status = 403;
      ctx.body = { message: '权限不足' };
      return;
    }

    await next();
  };
}

/**
 * 分类粒度权限中间件
 * 检查用户是否有权限操作指定分类
 * @param categoryIdPath 从请求中获取 categoryId 的路径,如 'body.categoryId' 或 'params.categoryId'
 * @returns Koa 中间件
 */
export function requireCategoryPermission(categoryIdPath: string) {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    const user = ctx.state.user;

    // ADMIN 拥有所有权限
    if (user.role === 'ADMIN') {
      await next();
      return;
    }

    // 获取 categoryId
    const pathParts = categoryIdPath.split('.');
    let categoryId: number | undefined;

    if (pathParts[0] === 'body') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = (ctx.request as any).body;
      categoryId = Number(body?.[pathParts[1]]);
    } else if (pathParts[0] === 'params') {
      const postId = Number(ctx.params[pathParts[1]]);
      const post = await postService.getPostById(postId);
      categoryId = post?.category.id;
    }

    if (!categoryId || isNaN(categoryId)) {
      ctx.status = 400;
      ctx.body = { message: '缺少文章 ID' };
      return;
    }

    // 检查 EDITOR 是否有该分类的权限
    const permission = await prisma.userCategoryPermission.findUnique({
      where: {
        userId_categoryId: {
          userId: user.userId,
          categoryId: categoryId,
        },
      },
    });

    if (!permission) {
      ctx.status = 403;
      ctx.body = { message: '您没有权限操作该分类下的内容' };
      return;
    }

    await next();
  };
}
