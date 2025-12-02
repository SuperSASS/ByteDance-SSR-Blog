import { useLoaderData } from 'react-router-dom';
import { PostCard } from '@/components/blog/PostCard';
import { SiteRightAside } from '@/components/common/SiteRightAside';
import type { PostSummaryDto, CategoryDto, TagDto } from 'ssr-blog-shared';

export function HomePage() {
  const { posts, categories, tags, archives } = useLoaderData() as {
    posts: PostSummaryDto[];
    categories: CategoryDto[];
    tags: TagDto[];
    archives: { year: number; count: number }[];
  };

  return (
    <div className="flex gap-8">
      <div className="flex-1 space-y-8">
        <div className="grid gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      <SiteRightAside tags={tags} archives={archives} />
    </div>
  );
}
