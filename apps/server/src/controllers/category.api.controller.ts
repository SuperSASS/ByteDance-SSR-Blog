import type { Context } from 'koa';
import { categoryService } from '../services/category.service.js';
import type { CreateCategoryDto, UpdateCategoryDto } from 'ssr-blog-shared';

export const categoryApiController = {
  async createCategory(ctx: Context) {
    const body = ctx.request.body as CreateCategoryDto;

    try {
      const category = await categoryService.createCategory(body);
      ctx.status = 201;
      ctx.body = category;
    } catch (error: any) {
      ctx.status = 400;
      ctx.body = { message: error.message || 'Failed to create category' };
    }
  },

  async updateCategory(ctx: Context) {
    const id = Number(ctx.params.id);
    const body = ctx.request.body as UpdateCategoryDto;

    try {
      const category = await categoryService.updateCategory(id, body);
      ctx.body = category;
    } catch (error: any) {
      ctx.status = 404;
      ctx.body = { message: error.message || 'Category not found' };
    }
  },

  async deleteCategory(ctx: Context) {
    const id = Number(ctx.params.id);

    try {
      await categoryService.deleteCategory(id);
      ctx.status = 204;
    } catch (error: any) {
      ctx.status = 404;
      ctx.body = { message: error.message || 'Category not found' };
    }
  },

  async getCategory(ctx: Context) {
    const id = Number(ctx.params.id);

    const category = await categoryService.getCategoryById(id);
    if (!category) {
      ctx.status = 404;
      ctx.body = { message: 'Category not found' };
      return;
    }

    ctx.body = category;
  },

  async getCategories(ctx: Context) {
    try {
      console.log('Fetching categories...');
      const categories = await categoryService.getCategories();
      console.log('Categories fetched:', categories.length);
      ctx.body = categories;
    } catch (error: any) {
      console.error('Error in listCategories:', error);
      ctx.status = 500;
      ctx.body = { message: error.message, stack: error.stack };
    }
  },
};
