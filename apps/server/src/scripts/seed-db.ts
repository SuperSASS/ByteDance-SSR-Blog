// apps/server/src/scripts/test-db.ts
import { prisma } from '../db/prisma.js';
import { postService } from '../services/post.service.js';

async function main() {
  console.log('🌱 Starting database seed/test...');

  // 0. RESET: 清空表（开发环境用）
  console.log('🧹 Resetting tables...');
  await prisma.$transaction([
    // 注意删除顺序：先删关联表，再删主表，避免外键约束问题
    prisma.postTag.deleteMany(),
    prisma.userCategoryPermission.deleteMany(),
    prisma.post.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log('🧹 Tables cleared.\n');

  // 1. Create a User
  console.log('👤 Creating admin user...');
  const user = await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: '12345678', // TODO: 实际应用中请改为加密后的 hash
      role: 'ADMIN',
    },
  });
  console.log('👤 User created:', user.id);

  // 2. Create Categories
  console.log('📂 Creating categories...');
  const techCategory = await prisma.category.create({
    data: {
      name: '科技',
      slug: 'tech',
    },
  });

  const lifeCategory = await prisma.category.create({
    data: {
      name: '生活',
      slug: 'life',
    },
  });
  console.log('📂 Categories created:', techCategory.id, lifeCategory.id);

  // 3. Create Tags
  console.log('🏷️ Creating tags...');
  const reactTag = await prisma.tag.create({
    data: { name: 'React', slug: 'react' },
  });

  const ssrTag = await prisma.tag.create({
    data: { name: 'SSR', slug: 'ssr' },
  });
  console.log('🏷️ Tags created:', reactTag.id, ssrTag.id);

  // 4. Create Posts
  console.log('📝 Creating posts...');

  // Post 1: Published
  const post1 = await postService.createPost({
    title: 'Hello SSR Blog',
    slug: 'hello-ssr-blog',
    content: '# Hello World\nThis is my first SSR blog post.',
    summary: 'First post summary',
    author: { connect: { id: user.id } },
    category: { connect: { id: techCategory.id } },
    publishedAt: new Date(),
    tags: {
      create: [
        { tag: { connect: { id: reactTag.id } } },
        { tag: { connect: { id: ssrTag.id } } },
      ],
    },
  });
  console.log('📝 Created Post 1:', post1.id);

  // Post 2: Draft (Unpublished)
  const post2 = await postService.createPost({
    title: 'Draft Post',
    slug: 'draft-post',
    content: 'This is a draft.',
    summary: 'Draft summary',
    author: { connect: { id: user.id } },
    category: { connect: { id: lifeCategory.id } },
    // No publishedAt
  });
  console.log('📝 Created Post 2:', post2.id);

  // 5. Verify Queries
  console.log('\n--- 🔍 Verification ---');

  const allPosts = await postService.getPosts();
  console.log(`Total posts: ${allPosts.length}`);
  console.log('All post slugs:', allPosts.map((p) => p.slug).join(', '));

  const publishedPosts = await postService.getPostByPublished();
  console.log(`Published posts: ${publishedPosts.length}`);
  console.log('Published slugs:', publishedPosts.map((p) => p.slug).join(', '));

  const fetchedPost = await postService.getPostById(post1.id);
  console.log(`Fetched Post 1 Title: ${fetchedPost?.title}`);
  console.log(
    `Fetched Post 1 Tags: ${fetchedPost?.tags
      .map((t) => t.tag.name)
      .join(', ')}`
  );

  console.log('\n✅ Database seed/test completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed/test failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
