import { prisma } from '../db/prisma.js';
import type {
  CreatePostDto,
  UpdatePostDto,
  PostSummaryDto,
  PostDetailDto,
  PaginationQuery,
} from 'ssr-blog-shared';
import { estimateReadingTime } from '../utils/estimateReadingTime.js';

// 将 Prisma Post 转换为 PostSummaryDto
function toPostSummaryDto(post: any): PostSummaryDto {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    coverImageUrl: post.coverImageUrl,
    readTime: post.readTime,
    views: post.views,
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

// 浏览记录缓存：Key = "ip:postId", Value = 时间戳 (毫秒)
const recentViews = new Map<string, number>();

// 防刷时间窗口 (30秒)
const RESTRICTION_WINDOW_MS = 30 * 1000;

// 清理间隔 (1小时)，防止内存泄漏
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

// 定期清理过期的浏览记录
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of recentViews.entries()) {
    if (now - timestamp > RESTRICTION_WINDOW_MS) {
      recentViews.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

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
        readTime: estimateReadingTime(data.content),
        author: { connect: { id: authorId } },
        category: { connect: { id: data.categoryId } },
        tags: {
          create: data.tagIds.map((tagId: number) => ({
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
        create: data.tagIds.map((tagId: number) => ({
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
    // Delete related tags first (manual cascade)
    await prisma.postTag.deleteMany({
      where: { postId: id },
    });

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

  async getPosts(
    query?: PaginationQuery,
    filter?: { categoryIds?: number[]; authorId?: number }
  ): Promise<PostSummaryDto[]> {
    const where: any = {};

    if (filter?.categoryIds) {
      where.categoryId = { in: filter.categoryIds };
    }
    if (filter?.authorId) {
      where.authorId = filter.authorId;
    }

    const posts = await prisma.post.findMany({
      where,
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

  async getPostsByCategory(categoryId: number): Promise<PostSummaryDto[]> {
    const posts = await prisma.post.findMany({
      where: {
        categoryId,
        publishedAt: { not: null },
      },
      orderBy: { publishedAt: 'desc' },
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

  async getPostsByTag(tagId: number): Promise<PostSummaryDto[]> {
    const posts = await prisma.post.findMany({
      where: {
        tags: {
          some: {
            tagId,
          },
        },
        publishedAt: { not: null },
      },
      orderBy: { publishedAt: 'desc' },
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

  async getPostsByYear(year: number): Promise<PostSummaryDto[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const posts = await prisma.post.findMany({
      where: {
        publishedAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: { publishedAt: 'desc' },
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

  async getArchiveStatistics(): Promise<{ year: number; count: number }[]> {
    const posts = await prisma.post.findMany({
      where: {
        publishedAt: { not: null },
      },
      select: {
        publishedAt: true,
      },
    });

    const yearCounts = new Map<number, number>();
    posts.forEach((post) => {
      if (post.publishedAt) {
        const year = post.publishedAt.getFullYear();
        yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
      }
    });

    return Array.from(yearCounts.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => b.year - a.year);
  },

  /**
   * 增加文章阅读量（带防刷机制）
   * @param postId - 文章 ID
   * @param ip - 请求者 IP（用于识别来源）
   * @returns boolean - 是否增加成功（true=增加，false=被限流）
   */
  async incrementView(postId: number, ip: string): Promise<boolean> {
    const key = `${ip}:${postId}`;
    const now = Date.now();
    const lastViewTime = recentViews.get(key);

    // 防刷检查：同一 IP 在时间窗口内访问同一文章
    if (lastViewTime && now - lastViewTime < RESTRICTION_WINDOW_MS) {
      return false; // 最近已访问，不计数
    }

    // 更新时间戳
    recentViews.set(key, now);

    // 数据库原子增量更新
    try {
      await prisma.post.update({
        where: { id: postId },
        data: {
          views: {
            increment: 1,
          },
        },
      });
      return true;
    } catch (error) {
      console.error(`更新文章 ${postId} 阅读量失败:`, error);
      // 即使数据库更新失败，也算作“已访问”以触发限流，避免数据库压力
      return false;
    }
  },
};
