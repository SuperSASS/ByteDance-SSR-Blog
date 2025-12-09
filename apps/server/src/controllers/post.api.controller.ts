import type { Context } from 'koa';
import { postService } from '../services/post.service.js';
import type { CreatePostDto, UpdatePostDto } from 'ssr-blog-shared';

export const postApiController = {
  async createPost(ctx: Context) {
    const body = ctx.request.body as CreatePostDto;
    // Get authorId from authenticated user
    const user = ctx.state.user;
    if (!user || !user.userId) {
      ctx.status = 401;
      ctx.body = { message: 'Unauthorized' };
      return;
    }
    const authorId = user.userId;

    try {
      const post = await postService.createPost(body, authorId);
      ctx.status = 201;
      ctx.body = post;
    } catch (error: any) {
      ctx.status = 400;
      ctx.body = { message: error.message || 'Failed to create post' };
    }
  },

  async updatePost(ctx: Context) {
    const id = Number(ctx.params.id);
    const body = ctx.request.body as UpdatePostDto;

    try {
      const post = await postService.updatePost(id, body);
      ctx.body = post;
    } catch (error: any) {
      ctx.status = 404;
      ctx.body = { message: error.message || 'Post not found' };
    }
  },

  async deletePost(ctx: Context) {
    const id = Number(ctx.params.id);

    try {
      await postService.deletePost(id);
      ctx.status = 204;
    } catch (error: any) {
      ctx.status = 404;
      ctx.body = { message: error.message || 'Post not found' };
    }
  },

  async getPost(ctx: Context) {
    const id = Number(ctx.params.id);

    const post = await postService.getPostById(id);
    if (!post) {
      ctx.status = 404;
      ctx.body = { message: 'Post not found' };
      return;
    }

    ctx.body = post;
  },

  async getPosts(ctx: Context) {
    const { page, limit, orderBy, order, published } = ctx.query;

    const query = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      orderBy: orderBy as string | undefined,
      order: (order as 'asc' | 'desc') || undefined,
    };

    const posts =
      published === 'true'
        ? await postService.getPublishedPosts(query)
        : await postService.getPosts(query);

    ctx.body = posts;
  },

  async getAdminPosts(ctx: Context) {
    const { page, limit, orderBy, order } = ctx.query;
    const query = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      orderBy: orderBy as string | undefined,
      order: (order as 'asc' | 'desc') || undefined,
    };
    // Admin sees all posts
    const posts = await postService.getPosts(query);
    ctx.body = posts;
  },

  async getPostsByCategory(ctx: Context) {
    const categoryId = Number(ctx.params.categoryId);
    const posts = await postService.getPostsByCategory(categoryId);
    ctx.body = posts;
  },

  async getPostsByTag(ctx: Context) {
    const tagId = Number(ctx.params.tagId);
    const posts = await postService.getPostsByTag(tagId);
    ctx.body = posts;
  },

  async getPostsByYear(ctx: Context) {
    const year = Number(ctx.params.year);
    const posts = await postService.getPostsByYear(year);
    ctx.body = posts;
  },

  async getArchiveStatistics(ctx: Context) {
    const stats = await postService.getArchiveStatistics();
    ctx.body = stats;
  },

  async incrementView(ctx: Context) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid ID' };
      return;
    }

    // 获取 IP（兼容代理）
    const ip = ctx.ip || ctx.request.ip || 'unknown';

    const increased = await postService.incrementView(id, ip);

    ctx.body = {
      success: true,
      increased,
    };
  },
};
