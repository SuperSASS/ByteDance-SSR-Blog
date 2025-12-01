import type { Context } from 'koa';
import { postService } from '../services/post.service.js';
import type { CreatePostDto, UpdatePostDto } from 'ssr-blog-shared';

export const postApiController = {
  async createPost(ctx: Context) {
    const body = ctx.request.body as CreatePostDto;
    // TODO: Get authorId from authenticated user
    const authorId = 1; // Hardcoded for now

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
};
