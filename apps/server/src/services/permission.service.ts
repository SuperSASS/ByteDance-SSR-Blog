import { prisma } from '../db/prisma.js';
import type { CreatePermissionDto, PermissionDto } from 'ssr-blog-shared';

// Transform Prisma Permission to PermissionDto
function toPermissionDto(permission: any): PermissionDto {
  return {
    userId: permission.userId,
    categoryId: permission.categoryId,
  };
}

export const permissionService = {
  async grantPermission(data: CreatePermissionDto): Promise<PermissionDto> {
    const permission = await prisma.userCategoryPermission.create({
      data: {
        userId: data.userId,
        categoryId: data.categoryId,
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
    });
    return permissions.map(toPermissionDto);
  },

  async getCategoryPermissions(categoryId: number): Promise<PermissionDto[]> {
    const permissions = await prisma.userCategoryPermission.findMany({
      where: { categoryId },
    });
    return permissions.map(toPermissionDto);
  },
};
