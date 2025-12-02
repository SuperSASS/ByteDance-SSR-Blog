import type { RouteObject } from 'react-router-dom';
import { SiteLayout } from '@/layouts/SiteLayout';
import { HomePage } from '@/pages/blog/HomePage';
import { PostDetailPage } from '@/pages/blog/PostDetailPage';
import { TagPage } from '@/pages/blog/TagPage';
import { CategoryPage } from '@/pages/blog/CategoryPage';
import { ArchivePage } from '@/pages/blog/ArchivePage';
import { YearArchivePage } from '@/pages/blog/YearArchivePage';
import { AboutPage } from '@/pages/blog/AboutPage';
import { NotFoundPage } from '@/pages/boundary/NotFoundPage';
import { postApi } from '@/services/api/post';
import { categoryApi } from '@/services/api/category';
import { tagApi } from '@/services/api/tag';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      {
        index: true,
        loader: async () => {
          // 主页需要：文章列表、分类列表、标签列表、归档统计
          const [posts, categories, tags, archives] = await Promise.all([
            postApi.getPublishedPosts(),
            categoryApi.getCategories(),
            tagApi.getTags(),
            postApi.getArchiveStatistics(),
          ]);
          return { posts, categories, tags, archives };
        },
        element: <HomePage />,
      },
      {
        path: 'posts/:id',
        loader: async ({ params }) => {
          // 文章详情页需要：文章详情
          const post = await postApi.getPostById(Number(params.id!));
          if (!post) {
            throw new Response('Not Found', { status: 404 });
          }
          return { post };
        },
        element: <PostDetailPage />,
      },
      {
        path: 'categories/:id',
        loader: async ({ params }) => {
          // 分类页需要：分类信息、该分类下的文章
          const [category, posts] = await Promise.all([
            categoryApi.getCategoryById(Number(params.id!)),
            postApi.getPostsByCategory(Number(params.id!)),
          ]);
          if (!category) {
            throw new Response('Not Found', { status: 404 });
          }
          return { category, posts };
        },
        element: <CategoryPage />,
      },
      {
        path: 'tags/:id',
        loader: async ({ params }) => {
          // 标签页需要：标签信息、该标签下的文章
          const [tag, posts] = await Promise.all([
            tagApi.getTagById(Number(params.id!)),
            postApi.getPostsByTag(Number(params.id!)),
          ]);
          if (!tag) {
            throw new Response('Not Found', { status: 404 });
          }
          return { tag, posts };
        },
        element: <TagPage />,
      },
      {
        path: 'archive',
        loader: async () => {
          // 归档页需要：分类列表、归档统计、所有已发布文章
          const [categories, archives] = await Promise.all([
            categoryApi.getCategories(),
            postApi.getArchiveStatistics(),
          ]);
          const allPosts = await postApi.getPublishedPosts();
          return { categories, archives, allPosts };
        },
        element: <ArchivePage />,
      },
      {
        path: 'archives/:year',
        loader: async ({ params }) => {
          // 年份归档页需要：该年份的文章
          const year = Number(params.year!);
          const posts = await postApi.getPostsByYear(year);
          return { posts, year };
        },
        element: <YearArchivePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];
