import { prisma } from '../db/prisma.js';
import type { CreateTagDto, UpdateTagDto, TagDto } from 'ssr-blog-shared';

// Transform Prisma Tag to TagDto
function toTagDto(tag: any, includePostCount = false): TagDto {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    postCount: includePostCount ? tag._count?.posts : undefined,
  };
}

export const tagService = {
  async createTag(data: CreateTagDto): Promise<TagDto> {
    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
    return toTagDto(tag);
  },

  async updateTag(id: number, data: UpdateTagDto): Promise<TagDto> {
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
      },
    });
    return toTagDto(tag);
  },

  async deleteTag(id: number): Promise<void> {
    await prisma.tag.delete({
      where: { id },
    });
  },

  async getTagById(id: number): Promise<TagDto | null> {
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
    return tag ? toTagDto(tag, true) : null;
  },

  async getTags(): Promise<TagDto[]> {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    return tags.map((t) => toTagDto(t, true));
  },
};
