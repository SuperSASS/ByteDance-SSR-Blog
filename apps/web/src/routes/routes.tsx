import type { RouteObject } from 'react-router-dom';
import { SiteLayout } from '@/layouts/SiteLayout';
import { HomePage } from '@/pages/blog/HomePage';
import { PostDetailPage } from '@/pages/blog/PostDetailPage';
import { TagPage } from '@/pages/blog/TagPage';
import { AboutPage } from '@/pages/blog/AboutPage';
import { NotFoundPage } from '@/pages/boundary/NotFoundPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'posts/:id',
        element: <PostDetailPage />,
      },
      {
        path: 'tags/:slug',
        element: <TagPage />,
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
