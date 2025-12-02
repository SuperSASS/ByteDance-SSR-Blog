export interface MockCategory {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}

export const mockCategories: MockCategory[] = [
  { id: 1, name: '科技', slug: 'tech', postCount: 4 },
  { id: 2, name: '生活', slug: 'life', postCount: 1 },
];
