import type { Context } from 'koa';
import { userService } from '../services/user.service.js';
import type { CreateUserDto, UpdateUserDto } from 'ssr-blog-shared';

export const userApiController = {
  async createUser(ctx: Context) {
    const body = ctx.request.body as CreateUserDto;

    try {
      const user = await userService.createUser(body);
      ctx.status = 201;
      ctx.body = user;
    } catch (error: any) {
      ctx.status = 400;
      ctx.body = { message: error.message || 'Failed to create user' };
    }
  },

  async updateUser(ctx: Context) {
    const id = Number(ctx.params.id);
    const body = ctx.request.body as UpdateUserDto;

    try {
      const user = await userService.updateUser(id, body);
      ctx.body = user;
    } catch (error: any) {
      ctx.status = 404;
      ctx.body = { message: error.message || 'User not found' };
    }
  },

  async deleteUser(ctx: Context) {
    const id = Number(ctx.params.id);

    try {
      await userService.deleteUser(id);
      ctx.status = 204;
    } catch (error: any) {
      ctx.status = 404;
      ctx.body = { message: error.message || 'User not found' };
    }
  },

  async getUser(ctx: Context) {
    const id = Number(ctx.params.id);

    const user = await userService.getUserById(id);
    if (!user) {
      ctx.status = 404;
      ctx.body = { message: 'User not found' };
      return;
    }

    ctx.body = user;
  },

  async getUsers(ctx: Context) {
    const { page, limit, orderBy, order } = ctx.query;

    const query = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      orderBy: orderBy as string | undefined,
      order: (order as 'asc' | 'desc') || undefined,
    };

    const users = await userService.getUsers(query);
    ctx.body = users;
  },
};
