import { PostCard } from '@/components/blog/PostCard';
import { mockPosts } from '@/mock/posts';

export function HomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">最新文章</h1>
        <p className="text-muted-foreground">分享技术、生活和思考</p>
      </div>

      <div className="grid gap-6">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
