import type { Post } from '@/types/blog';

export const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Hello SSR Blog',
    slug: 'hello-ssr-blog',
    summary:
      '这是我的第一篇 SSR 博客文章，介绍了如何使用 React 19 和 Koa 构建服务端渲染应用。',
    content: `# Hello World

这是我的第一篇 SSR 博客文章。

## 技术栈

{{ ... }}

- 服务端渲染 (SSR)
- 深色模式支持
- Markdown 渲染
- 响应式设计`,
    coverImageUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    publishedAt: '2024-12-01T10:00:00Z',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
    author: { id: 1, username: 'admin' },
    category: { id: 1, name: '科技', slug: 'tech', count: 3 },
    tags: [
      { id: 1, name: 'React', slug: 'react' },
      { id: 2, name: 'SSR', slug: 'ssr' },
    ],
    readTime: 5,
    views: 128,
  },
  {
    id: 2,
    title: 'TypeScript 最佳实践',
    slug: 'typescript-best-practices',
    summary: '分享一些在大型项目中使用 TypeScript 的最佳实践和经验总结。',
    content: `# TypeScript 最佳实践

在大型项目中，TypeScript 可以帮助我们...

## 类型定义

...`,
    coverImageUrl:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    publishedAt: '2024-11-28T14:30:00Z',
    createdAt: '2024-11-28T13:00:00Z',
    updatedAt: '2024-11-28T14:30:00Z',
    author: { id: 1, username: 'admin' },
    category: { id: 1, name: '科技', slug: 'tech', count: 3 },
    tags: [
      { id: 3, name: 'TypeScript', slug: 'typescript' },
      { id: 4, name: '编程', slug: 'programming' },
    ],
    readTime: 8,
    views: 256,
  },
  {
    id: 3,
    title: '生活随笔：咖啡与代码',
    slug: 'coffee-and-code',
    summary: '记录一些关于咖啡和编程的随想，以及如何在工作中保持平衡。',
    content: `# 咖啡与代码

每天早晨的第一杯咖啡...`,
    coverImageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    publishedAt: '2024-11-25T08:00:00Z',
    createdAt: '2024-11-25T07:00:00Z',
    updatedAt: '2024-11-25T08:00:00Z',
    author: { id: 1, username: 'admin' },
    category: { id: 2, name: '生活', slug: 'life', count: 1 },
    tags: [
      { id: 5, name: '随笔', slug: 'essay' },
      { id: 6, name: '咖啡', slug: 'coffee' },
    ],
    readTime: 3,
    views: 89,
  },
  {
    id: 4,
    title: 'Prisma ORM 入门指南',
    slug: 'prisma-orm-guide',
    summary:
      '详细介绍 Prisma ORM 的使用方法，包括 Schema 定义、Migration 和 Client 使用。',
    content: `# Prisma ORM 入门

Prisma 是一个现代化的 ORM...`,
    coverImageUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    publishedAt: '2024-11-20T16:00:00Z',
    createdAt: '2024-11-20T15:00:00Z',
    updatedAt: '2024-11-20T16:00:00Z',
    author: { id: 1, username: 'admin' },
    category: { id: 1, name: '科技', slug: 'tech', count: 3 },
    tags: [
      { id: 7, name: 'Prisma', slug: 'prisma' },
      { id: 8, name: 'Database', slug: 'database' },
    ],
    readTime: 12,
    views: 342,
  },
  {
    id: 5,
    title: '深色模式设计指南',
    slug: 'dark-mode-design',
    summary:
      '如何设计和实现一个优秀的深色模式，包括颜色选择、对比度和用户体验。',
    content: `# 深色模式设计

深色模式已经成为现代应用的标配...`,
    coverImageUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    publishedAt: '2024-11-15T12:00:00Z',
    createdAt: '2024-11-15T11:00:00Z',
    updatedAt: '2024-11-15T12:00:00Z',
    author: { id: 1, username: 'admin' },
    category: { id: 3, name: '设计', slug: 'design', count: 1 },
    tags: [
      { id: 9, name: 'UI/UX', slug: 'ui-ux' },
      { id: 10, name: '设计', slug: 'design' },
    ],
    readTime: 6,
    views: 198,
  },
];
