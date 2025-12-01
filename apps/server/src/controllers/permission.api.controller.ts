import type { Context } from 'koa';
import { permissionService } from '../services/permission.service.js';
import type { CreatePermissionDto } from 'ssr-blog-shared';

export const permissionApiController = {
  async grantPermission(ctx: Context) {
    const body = ctx.request.body as CreatePermissionDto;

    try {
      const permission = await permissionService.grantPermission(body);
      ctx.status = 201;
      ctx.body = permission;
    } catch (error: any) {
      ctx.status = 400;
      ctx.body = { message: error.message || 'Failed to grant permission' };
    }
  },

  async revokePermission(ctx: Context) {
    const userId = Number(ctx.params.userId);
    const categoryId = Number(ctx.params.categoryId);

    try {
      await permissionService.revokePermission(userId, categoryId);
      ctx.status = 204;
    } catch (error: any) {
      ctx.status = 404;
      ctx.body = { message: error.message || 'Permission not found' };
    }
  },

  async getUserPermissions(ctx: Context) {
    const userId = Number(ctx.params.userId);

    const permissions = await permissionService.getUserPermissions(userId);
    ctx.body = permissions;
  },

  async getCategoryPermissions(ctx: Context) {
    const categoryId = Number(ctx.params.categoryId);

    const permissions =
      await permissionService.getCategoryPermissions(categoryId);
    ctx.body = permissions;
  },
};
