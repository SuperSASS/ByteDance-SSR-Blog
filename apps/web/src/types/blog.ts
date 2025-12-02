export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number; // Post count
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count?: number; // Post count
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImageUrl: string | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
  category: Category;
  tags: Tag[];
  readTime: number; // minutes
  views: number;
}
