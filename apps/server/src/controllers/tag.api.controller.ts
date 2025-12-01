import type { Context } from 'koa';
import { tagService } from '../services/tag.service.js';
import type { CreateTagDto, UpdateTagDto } from 'ssr-blog-shared';

export const tagApiController = {
  async createTag(ctx: Context) {
    const body = ctx.request.body as CreateTagDto;

    try {
      const tag = await tagService.createTag(body);
      ctx.status = 201;
      ctx.body = tag;
    } catch (error: any) {
      ctx.status = 400;
      ctx.body = { message: error.message || 'Failed to create tag' };
    }
  },

  async updateTag(ctx: Context) {
    const id = Number(ctx.params.id);
    const body = ctx.request.body as UpdateTagDto;

    try {
      const tag = await tagService.updateTag(id, body);
      ctx.body = tag;
    } catch (error: any) {
      ctx.status = 404;
      ctx.body = { message: error.message || 'Tag not found' };
    }
  },

  async deleteTag(ctx: Context) {
    const id = Number(ctx.params.id);

    try {
      await tagService.deleteTag(id);
      ctx.status = 204;
    } catch (error: any) {
      ctx.status = 404;
      ctx.body = { message: error.message || 'Tag not found' };
    }
  },

  async getTag(ctx: Context) {
    const id = Number(ctx.params.id);

    const tag = await tagService.getTagById(id);
    if (!tag) {
      ctx.status = 404;
      ctx.body = { message: 'Tag not found' };
      return;
    }

    ctx.body = tag;
  },

  async getTags(ctx: Context) {
    const tags = await tagService.getTags();
    ctx.body = tags;
  },
};
