import type { Context } from 'koa';
import { prisma } from '../db/prisma.js';
import { Role } from '@prisma/client';

export const dashboardController = {
  async getStats(ctx: Context) {
    const [postCount, categoryCount, tagCount, userCount, totalViews] =
      await Promise.all([
        prisma.post.count({ where: { publishedAt: { not: null } } }),
        prisma.category.count(),
        prisma.tag.count(),
        prisma.user.count(),

        // 所有已发布文章浏览量总和
        prisma.post.aggregate({
          where: { publishedAt: { not: null } }, // 如果希望包含草稿，就去掉 where
          _sum: {
            views: true,
          },
        }),
      ]);

    ctx.body = {
      posts: postCount,
      categories: categoryCount,
      tags: tagCount,
      users: userCount,
      totalViews: totalViews._sum.views,
    };
  },

  async getPermissions(ctx: Context) {
    const user = ctx.state.user;

    if (!user) {
      ctx.status = 401;
      return;
    }

    if (user.role === Role.ADMIN) {
      // Admin has access to all categories
      const categories = await prisma.category.findMany({
        select: { id: true, name: true, slug: true },
      });
      ctx.body = {
        isAdmin: true,
        categories,
      };
      return;
    }

    // For other roles, fetch assigned permissions
    const permissions = await prisma.userCategoryPermission.findMany({
      where: { userId: user.userId },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    ctx.body = {
      isAdmin: false,
      categories: permissions.map((p) => p.category),
    };
  },
};
