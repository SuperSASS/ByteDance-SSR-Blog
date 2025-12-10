import type Koa from 'koa';
import * as authService from '../services/auth.service.js';
import type { LoginDto } from 'ssr-blog-shared';

/**
 * 用户登录
 * POST /api/auth/login
 */
export async function login(ctx: Koa.Context) {
  try {
    const loginDto = ctx.request.body as LoginDto;

    // 验证请求体
    if (!loginDto.username || !loginDto.password) {
      ctx.status = 400;
      ctx.body = { message: '用户名和密码不能为空' };
      return;
    }

    // 登录验证（失败抛出异常、成功继续）
    const authResponse = await authService.login(loginDto);

    // 把 JWT 写到 HttpOnly Cookie 中
    ctx.cookies.set('auth_token', authResponse.token, {
      httpOnly: true, // 前端 JS 读不到，更安全
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
      //secure: process.env.NODE_ENV === 'production', // 生产环境只使用 HTTPS
      // 注：由于目前生产环境使用 npm start 仍为 HTTP，故这里暂时注释掉
    });

    // 返回 user 信息
    ctx.body = {
      user: authResponse.user,
    };
  } catch (error) {
    ctx.status = 401;
    ctx.body = { message: (error as Error).message };
  }
}

/**
 * 用户退出登录
 * POST /api/auth/logout
 */
export async function logout(ctx: Koa.Context) {
  ctx.cookies.set('auth_token', null, {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  ctx.status = 200;
  ctx.body = { message: '退出登录成功' };
}

/**
 * 获取当前用户信息
 * GET /api/auth/me
 * 需要认证（如果没传入 token，则不会进来，直接返回 401）
 */
export async function me(ctx: Koa.Context) {
  try {
    // koa-jwt 会将解析后的 payload 放入 ctx.state.user
    const userId = ctx.state.user.userId;
    const user = await authService.getUserById(userId);

    ctx.body = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  } catch (error) {
    ctx.status = 404;
    ctx.body = { message: (error as Error).message };
  }
}
