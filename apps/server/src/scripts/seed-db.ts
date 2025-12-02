// apps/server/src/scripts/seed-db.ts
import { prisma } from '../db/prisma.js';

async function main() {
  console.log('🌱 Starting database seed...');

  // 0. RESET: 清空表（开发环境用）
  console.log('🧹 Resetting tables...');
  await prisma.$transaction([
    prisma.postTag.deleteMany(),
    prisma.userCategoryPermission.deleteMany(),
    prisma.post.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log('🧹 Tables cleared.\n');

  // 1. Create Users
  console.log('👤 Creating users...');
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: 'hashed_admin_password', // TODO: bcrypt hash
      role: 'ADMIN',
    },
  });
  console.log('👤 Admin user created:', adminUser.id);

  // 2. Create Categories
  console.log('📂 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({ data: { name: '前端开发', slug: 'frontend' } }),
    prisma.category.create({ data: { name: '后端开发', slug: 'backend' } }),
    prisma.category.create({ data: { name: '数据库', slug: 'database' } }),
    prisma.category.create({ data: { name: '生活随笔', slug: 'life' } }),
    prisma.category.create({ data: { name: '设计', slug: 'design' } }),
  ]);
  console.log('📂 Categories created:', categories.length);

  // 3. Create Tags
  console.log('🏷️ Creating tags...');
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'React', slug: 'react' } }),
    prisma.tag.create({ data: { name: 'TypeScript', slug: 'typescript' } }),
    prisma.tag.create({ data: { name: 'SSR', slug: 'ssr' } }),
    prisma.tag.create({ data: { name: 'Vite', slug: 'vite' } }),
    prisma.tag.create({ data: { name: 'Node.js', slug: 'nodejs' } }),
    prisma.tag.create({ data: { name: 'Koa', slug: 'koa' } }),
    prisma.tag.create({ data: { name: 'Prisma', slug: 'prisma' } }),
    prisma.tag.create({ data: { name: 'SQLite', slug: 'sqlite' } }),
    prisma.tag.create({ data: { name: 'MySQL', slug: 'mysql' } }),
    prisma.tag.create({ data: { name: 'Tailwind CSS', slug: 'tailwindcss' } }),
    prisma.tag.create({ data: { name: 'UI设计', slug: 'ui-design' } }),
    prisma.tag.create({ data: { name: '摄影', slug: 'photography' } }),
  ]);
  console.log('🏷️ Tags created:', tags.length);

  // 4. Create Posts
  console.log('📝 Creating posts...');

  const postsData = [
    {
      title: 'Hello SSR Blog',
      slug: 'hello-ssr-blog',
      summary:
        '这是我的第一篇 SSR 博客文章，介绍了如何使用 React 19 和 Koa 构建服务端渲染应用。',
      content: `# Hello World

这是我的第一篇 SSR 博客文章。

## 什么是 SSR

SSR (Server-Side Rendering) 是一种在服务器端渲染 React 组件的技术...

## 项目特性

- React 19
- React Router 7
- 服务端渲染
- 深色模式支持
- Markdown 渲染
- 响应式设计`,
      coverImageUrl:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      categoryId: categories[0].id, // 前端开发
      tagIds: [tags[0].id, tags[1].id, tags[2].id], // React, TypeScript, SSR
      publishedAt: new Date('2024-12-01T10:00:00Z'),
      readTime: 8,
      views: 156,
    },
    {
      title: 'TypeScript 类型体操进阶',
      slug: 'typescript-advanced-types',
      summary:
        '详细介绍 TypeScript 中的高级类型操作，包括条件类型、映射类型等。',
      content: `# TypeScript 类型体操

在 TypeScript 中，类型系统非常强大...

## 条件类型

...

## 映射类型

...`,
      coverImageUrl:
        'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      categoryId: categories[0].id,
      tagIds: [tags[1].id], // TypeScript
      publishedAt: new Date('2024-11-28T14:30:00Z'),
      readTime: 12,
      views: 234,
    },
    {
      title: '咖啡与代码',
      slug: 'coffee-and-code',
      summary: '程序员与咖啡的不解之缘，分享我的咖啡之旅。',
      content: `# 咖啡与代码

每天早晨的第一杯咖啡...`,
      coverImageUrl:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
      categoryId: categories[3].id, // 生活随笔
      tagIds: [tags[11].id], // 摄影
      publishedAt: new Date('2024-11-25T08:00:00Z'),
      readTime: 5,
      views: 89,
    },
    {
      title: 'Prisma ORM 入门指南',
      slug: 'prisma-orm-guide',
      summary:
        '详细介绍 Prisma ORM 的使用方法，包括 Schema 定义、Migration 和 Client 使用。',
      content: `# Prisma ORM 入门

Prisma 是一个现代化的 ORM...`,
      coverImageUrl:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      categoryId: categories[2].id, // 数据库
      tagIds: [tags[6].id, tags[7].id], // Prisma, SQLite
      publishedAt: new Date('2024-11-20T16:00:00Z'),
      readTime: 15,
      views: 312,
    },
    {
      title: '深色模式设计指南',
      slug: 'dark-mode-design',
      summary:
        '如何设计和实现一个优秀的深色模式，包括颜色选择、对比度和用户体验。',
      content: `# 深色模式设计

深色模式已经成为现代应用的标配...`,
      coverImageUrl:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      categoryId: categories[4].id, // 设计
      tagIds: [tags[10].id], // UI设计
      publishedAt: new Date('2024-11-15T12:00:00Z'),
      readTime: 10,
      views: 178,
    },
    {
      title: 'Koa 中间件机制详解',
      slug: 'koa-middleware-explained',
      summary: '深入理解 Koa 的洋葱模型中间件机制，以及如何编写自定义中间件。',
      content: `# Koa 中间件机制

Koa 的中间件使用洋葱模型...`,
      coverImageUrl:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      categoryId: categories[1].id, // 后端开发
      tagIds: [tags[4].id, tags[5].id], // Node.js, Koa
      publishedAt: new Date('2024-10-30T09:00:00Z'),
      readTime: 18,
      views: 425,
    },
    {
      title: 'Vite 构建优化实践',
      slug: 'vite-build-optimization',
      summary: '分享 Vite 项目的构建优化经验，包括代码分割、懒加载等技巧。',
      content: `# Vite 构建优化

Vite 作为新一代前端构建工具...`,
      coverImageUrl:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      categoryId: categories[0].id,
      tagIds: [tags[3].id, tags[0].id], // Vite, React
      publishedAt: new Date('2023-12-15T14:00:00Z'),
      readTime: 20,
      views: 567,
    },
    {
      title: 'Tailwind CSS 最佳实践',
      slug: 'tailwind-css-best-practices',
      summary: '总结 Tailwind CSS 在实际项目中的最佳实践和常见问题解决方案。',
      content: `# Tailwind CSS 最佳实践

Tailwind CSS 是一个功能类优先的 CSS 框架...`,
      coverImageUrl:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      categoryId: categories[0].id,
      tagIds: [tags[9].id], // Tailwind CSS
      publishedAt: new Date('2023-11-20T10:30:00Z'),
      readTime: 14,
      views: 389,
    },
  ];

  for (const postData of postsData) {
    const { tagIds, readTime, views, ...restData } = postData;
    await prisma.post.create({
      data: {
        ...restData,
        authorId: adminUser.id,
        tags: {
          create: tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
    });
  }
  console.log('📝 Created', postsData.length, 'posts');

  // 5. Verify
  console.log('\n--- 🔍 Verification ---');
  const publishedPosts = await prisma.post.findMany({
    where: { publishedAt: { not: null } },
  });
  console.log(`Total published posts: ${publishedPosts.length}`);

  const allCategories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
  });
  console.log(
    'Categories:',
    allCategories.map((c) => `${c.name}(${c._count.posts})`).join(', ')
  );

  console.log('\n✅ Database seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
