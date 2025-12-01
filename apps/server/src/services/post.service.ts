import { prisma } from '../db/prisma.js';
import type {
  CreatePostDto,
  UpdatePostDto,
  PostSummaryDto,
  PostDetailDto,
  PaginationQuery,
} from 'ssr-blog-shared';

// Transform Prisma Post to PostSummaryDto
function toPostSummaryDto(post: any): PostSummaryDto {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    coverImageUrl: post.coverImageUrl,
    publishedAt: post.publishedAt?.toISOString() || null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    author: {
      id: post.author.id,
      username: post.author.username,
    },
    category: {
      id: post.category.id,
      name: post.category.name,
      slug: post.category.slug,
    },
    tags: post.tags.map((pt: any) => ({
      id: pt.tag.id,
      name: pt.tag.name,
      slug: pt.tag.slug,
    })),
  };
}

// Transform Prisma Post to PostDetailDto
function toPostDetailDto(post: any): PostDetailDto {
  return {
    ...toPostSummaryDto(post),
    content: post.content,
  };
}

export const postService = {
  async createPost(
    data: CreatePostDto,
    authorId: number
  ): Promise<PostDetailDto> {
    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        summary: data.summary,
        coverImageUrl: data.coverImageUrl,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        author: { connect: { id: authorId } },
        category: { connect: { id: data.categoryId } },
        tags: {
          create: data.tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return toPostDetailDto(post);
  },

  async updatePost(id: number, data: UpdatePostDto): Promise<PostDetailDto> {
    // Handle tag updates if provided
    const updateData: any = {
      ...(data.title && { title: data.title }),
      ...(data.slug && { slug: data.slug }),
      ...(data.content && { content: data.content }),
      ...(data.summary !== undefined && { summary: data.summary }),
      ...(data.coverImageUrl !== undefined && {
        coverImageUrl: data.coverImageUrl,
      }),
      ...(data.categoryId && {
        category: { connect: { id: data.categoryId } },
      }),
      ...(data.publishedAt !== undefined && {
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      }),
    };

    // If tagIds are provided, replace all tags
    if (data.tagIds) {
      await prisma.postTag.deleteMany({
        where: { postId: id },
      });
      updateData.tags = {
        create: data.tagIds.map((tagId) => ({
          tag: { connect: { id: tagId } },
        })),
      };
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return toPostDetailDto(post);
  },

  async deletePost(id: number): Promise<void> {
    await prisma.post.delete({
      where: { id },
    });
  },

  async getPostById(id: number): Promise<PostDetailDto | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return post ? toPostDetailDto(post) : null;
  },

  async getPosts(query?: PaginationQuery): Promise<PostSummaryDto[]> {
    const posts = await prisma.post.findMany({
      skip:
        query?.page && query?.limit
          ? (query.page - 1) * query.limit
          : undefined,
      take: query?.limit,
      orderBy: query?.orderBy
        ? { [query.orderBy]: query.order || 'asc' }
        : { createdAt: 'desc' },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return posts.map(toPostSummaryDto);
  },

  async getPublishedPosts(query?: PaginationQuery): Promise<PostSummaryDto[]> {
    const posts = await prisma.post.findMany({
      where: {
        publishedAt: {
          not: null,
        },
      },
      skip:
        query?.page && query?.limit
          ? (query.page - 1) * query.limit
          : undefined,
      take: query?.limit,
      orderBy: query?.orderBy
        ? { [query.orderBy]: query.order || 'asc' }
        : { publishedAt: 'desc' },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return posts.map(toPostSummaryDto);
  },
};
