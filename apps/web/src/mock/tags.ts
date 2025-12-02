export interface MockTag {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}

export const mockTags: MockTag[] = [
  { id: 1, name: 'React', slug: 'react', postCount: 1 },
  { id: 2, name: 'SSR', slug: 'ssr', postCount: 1 },
  { id: 3, name: 'TypeScript', slug: 'typescript', postCount: 1 },
  { id: 4, name: '编程', slug: 'programming', postCount: 1 },
  { id: 5, name: '随笔', slug: 'essay', postCount: 1 },
  { id: 6, name: '咖啡', slug: 'coffee', postCount: 1 },
  { id: 7, name: 'Prisma', slug: 'prisma', postCount: 1 },
  { id: 8, name: 'Database', slug: 'database', postCount: 1 },
  { id: 9, name: 'UI/UX', slug: 'ui-ux', postCount: 1 },
  { id: 10, name: '设计', slug: 'design', postCount: 1 },
];
