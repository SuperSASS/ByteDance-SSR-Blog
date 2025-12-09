import { redirect, type RouteObject } from 'react-router-dom';
import { SiteLayout } from '@/layouts/SiteLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { HomePage } from '@/pages/blog/HomePage';
import { PostDetailPage } from '@/pages/blog/PostDetailPage';
import { TagPage } from '@/pages/blog/TagPage';
import { CategoryPage } from '@/pages/blog/CategoryPage';
import { ArchivePage } from '@/pages/blog/ArchivePage';
import { YearArchivePage } from '@/pages/blog/YearArchivePage';
import { AboutPage } from '@/pages/blog/AboutPage';
import { NotFoundPage } from '@/pages/boundary/NotFoundPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminPostListPage } from '@/pages/admin/AdminPostListPage';
import { AdminPostEditPage } from '@/pages/admin/AdminPostEditPage';
import { AdminCategoryListPage } from '@/pages/admin/AdminCategoryListPage';
import { AdminTagListPage } from '@/pages/admin/AdminTagListPage';
import { AdminUserListPage } from '@/pages/admin/AdminUserListPage';
import { postApi } from '@/services/api/post';
import { categoryApi } from '@/services/api/category';
import { tagApi } from '@/services/api/tag';
import { dashboardApi } from '@/services/api/dashboard';
import { requireAuth } from '@/services/auth.server';
import { userApi } from '@/services/api/user';

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
  // 后台登录页(无需认证)
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  // 后台管理页面(需要认证)
  {
    path: '/admin',
    element: <AdminLayout />,
    loader: async ({ request }) => {
      // SSR + 浏览器 都会调用这里
      return await requireAuth(request);
    },
    children: [
      {
        index: true,
        loader: async ({ request }) => {
          const cookie = request.headers.get('cookie') || '';
          const headers = { cookie };
          const [stats, permissions] = await Promise.all([
            dashboardApi.getStats(headers),
            dashboardApi.getPermissions(headers),
          ]);
          return { stats, permissions };
        },
        element: <AdminDashboardPage />,
      },
      {
        path: 'posts',
        loader: async ({ request }) => {
          const cookie = request.headers.get('cookie') || '';
          return await postApi.getAdminPosts(undefined, { cookie });
        },
        // 删除
        action: async ({ request }) => {
          const cookie = request.headers.get('cookie') || '';
          const formData = await request.formData();
          const id = formData.get('id');
          if (request.method === 'DELETE' && id) {
            await postApi.deletePost(Number(id), { cookie });
            return { success: true };
          }
          return null;
        },
        element: <AdminPostListPage />,
      },
      {
        path: 'posts/new',
        loader: async () => {
          const [categories, tags] = await Promise.all([
            categoryApi.getCategories(),
            tagApi.getTags(),
          ]);
          return { categories, tags, post: null };
        },
        action: async ({ request }) => {
          const cookie = request.headers.get('cookie') || '';
          const formData = await request.formData();

          const data = {
            title: formData.get('title'),
            slug: formData.get('slug'),
            summary: formData.get('summary'),
            content: formData.get('content'),
            categoryId: Number(formData.get('categoryId')),
            coverImageUrl: formData.get('coverImageUrl'),
            publishedAt: formData.get('publishedAt')
              ? new Date(formData.get('publishedAt') as string).toISOString()
              : null,
            tagIds: formData.getAll('tagIds').map(Number),
          };

          await postApi.createPost(data, { cookie });
          return { success: true, redirect: '/admin/posts' };
        },
        element: <AdminPostEditPage />,
      },
      {
        path: 'posts/:id',
        loader: async ({ params }) => {
          const [categories, tags, post] = await Promise.all([
            categoryApi.getCategories(),
            tagApi.getTags(),
            postApi.getPostById(Number(params.id)),
          ]);
          return { categories, tags, post };
        },
        action: async ({ request, params }) => {
          const cookie = request.headers.get('cookie') || '';
          const formData = await request.formData();

          const data = {
            title: formData.get('title'),
            slug: formData.get('slug'),
            summary: formData.get('summary'),
            content: formData.get('content'),
            categoryId: Number(formData.get('categoryId')),
            coverImageUrl: formData.get('coverImageUrl'),
            publishedAt: formData.get('publishedAt')
              ? new Date(formData.get('publishedAt') as string).toISOString()
              : null,
            tagIds: formData.getAll('tagIds').map(Number),
          };

          await postApi.updatePost(Number(params.id), data, { cookie });
          return { success: true, redirect: '/admin/posts' };
        },
        element: <AdminPostEditPage />,
      },
      {
        path: 'categories',
        loader: async () => {
          const [categories] = await Promise.all([categoryApi.getCategories()]);
          return categories;
        },
        action: async ({ request }) => {
          const cookie = request.headers.get('cookie') || '';
          const formData = await request.formData();
          const intent = formData.get('intent');

          if (intent === 'delete') {
            await categoryApi.deleteCategory(Number(formData.get('id')), {
              cookie,
            });
            return { success: true };
          }

          if (intent === 'create') {
            const name = formData.get('name') as string;
            const slug = formData.get('slug') as string;
            await categoryApi.createCategory({ name, slug }, { cookie });
            return { success: true };
          }

          if (intent === 'update') {
            const id = Number(formData.get('id'));
            const name = formData.get('name') as string;
            const slug = formData.get('slug') as string;
            await categoryApi.updateCategory(id, { name, slug }, { cookie });
            return { success: true };
          }

          return null;
        },
        element: <AdminCategoryListPage />,
      },
      {
        path: 'tags',
        loader: async () => {
          return await tagApi.getTags(); // Public
        },
        action: async ({ request }) => {
          const cookie = request.headers.get('cookie') || '';
          const formData = await request.formData();
          const intent = formData.get('intent');

          if (intent === 'delete') {
            await tagApi.deleteTag(Number(formData.get('id')), { cookie });
            return { success: true };
          }

          if (intent === 'create') {
            const name = formData.get('name') as string;
            const slug = formData.get('slug') as string;
            await tagApi.createTag({ name, slug }, { cookie });
            return { success: true };
          }

          if (intent === 'update') {
            const id = Number(formData.get('id'));
            const name = formData.get('name') as string;
            const slug = formData.get('slug') as string;
            await tagApi.updateTag(id, { name, slug }, { cookie });
            return { success: true };
          }

          return null;
        },
        element: <AdminTagListPage />,
      },
      {
        path: 'users',
        loader: async ({ request }) => {
          const cookie = request.headers.get('cookie') || '';
          const [users, categories] = await Promise.all([
            userApi.getUsers({ cookie }),
            categoryApi.getCategories(),
          ]);
          return { users, categories };
        },
        action: async ({ request }) => {
          const cookie = request.headers.get('cookie') || '';
          const formData = await request.formData();
          const intent = formData.get('intent');

          if (intent === 'delete') {
            await userApi.deleteUser(Number(formData.get('id')), { cookie });
            return { success: true };
          }

          if (intent === 'create') {
            const username = formData.get('username') as string;
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;
            const role = formData.get('role') as any;
            await userApi.createUser(
              { username, email, password, role },
              { cookie }
            );
            return { success: true };
          }

          if (intent === 'update') {
            const id = Number(formData.get('id'));
            const username = formData.get('username') as string;
            const email = formData.get('email') as string;
            const role = formData.get('role') as any;
            const password = formData.get('password') as string;

            const data: any = { username, email, role };
            if (password) data.password = password;

            await userApi.updateUser(id, data, { cookie });
            return { success: true };
          }
          return null;
        },
        element: <AdminUserListPage />,
      },
    ],
  },
];
