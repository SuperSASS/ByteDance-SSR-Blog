import { prisma } from '../db/prisma.js';
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryDto,
} from 'ssr-blog-shared';

// Transform Prisma Category to CategoryDto
function toCategoryDto(category: any, includePostCount = false): CategoryDto {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    postCount: includePostCount ? category._count?.posts : undefined,
  };
}

export const categoryService = {
  async createCategory(data: CreateCategoryDto): Promise<CategoryDto> {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
    return toCategoryDto(category);
  },

  async updateCategory(
    id: number,
    data: UpdateCategoryDto
  ): Promise<CategoryDto> {
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
      },
    });
    return toCategoryDto(category);
  },

  async deleteCategory(id: number): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  },

  async getCategoryById(id: number): Promise<CategoryDto | null> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
    return category ? toCategoryDto(category, true) : null;
  },

  async getCategories(): Promise<CategoryDto[]> {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    return categories.map((c) => toCategoryDto(c, true));
  },
};
