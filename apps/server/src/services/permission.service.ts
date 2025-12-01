import { prisma } from '../db/prisma.js';
import type { CreatePermissionDto, PermissionDto } from 'ssr-blog-shared';

// Transform Prisma Permission to PermissionDto
function toPermissionDto(permission: any): PermissionDto {
  return {
    userId: permission.userId,
    categoryId: permission.categoryId,
    user: permission.user
      ? {
          id: permission.user.id,
          username: permission.user.username,
        }
      : undefined,
    category: permission.category
      ? {
          id: permission.category.id,
          name: permission.category.name,
          slug: permission.category.slug,
        }
      : undefined,
  };
}

export const permissionService = {
  async grantPermission(data: CreatePermissionDto): Promise<PermissionDto> {
    const permission = await prisma.userCategoryPermission.create({
      data: {
        userId: data.userId,
        categoryId: data.categoryId,
      },
      include: {
        user: true,
        category: true,
      },
    });
    return toPermissionDto(permission);
  },

  async revokePermission(userId: number, categoryId: number): Promise<void> {
    await prisma.userCategoryPermission.delete({
      where: {
        userId_categoryId: {
          userId,
          categoryId,
        },
      },
    });
  },

  async getUserPermissions(userId: number): Promise<PermissionDto[]> {
    const permissions = await prisma.userCategoryPermission.findMany({
      where: { userId },
      include: {
        user: true,
        category: true,
      },
    });
    return permissions.map(toPermissionDto);
  },

  async getCategoryPermissions(categoryId: number): Promise<PermissionDto[]> {
    const permissions = await prisma.userCategoryPermission.findMany({
      where: { categoryId },
      include: {
        user: true,
        category: true,
      },
    });
    return permissions.map(toPermissionDto);
  },
};
