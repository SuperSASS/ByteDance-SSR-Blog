// Post DTOs

export interface PostSummaryDto {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
  readTime: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    username: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export interface PostDetailDto extends PostSummaryDto {
  content: string;
}

export interface CreatePostDto {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  coverImageUrl?: string;
  categoryId: number;
  tagIds: number[];
  publishedAt?: string; // ISO string or null for draft
}

export interface UpdatePostDto {
  title?: string;
  slug?: string;
  content?: string;
  summary?: string;
  coverImageUrl?: string;
  categoryId?: number;
  tagIds?: number[];
  publishedAt?: string | null;
}
