import { useParams } from 'react-router-dom';
import { PostCard } from '@/components/blog/PostCard';
import { mockPosts } from '@/mock/posts';
import { mockTags } from '@/mock/tags';

export function TagPage() {
  const { slug } = useParams();
  const tag = mockTags.find((t) => t.slug === slug);
  const filteredPosts = mockPosts.filter((post) =>
    post.tags.some((t) => t.slug === slug)
  );

  if (!tag) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">标签未找到</h1>
        <p className="text-muted-foreground">抱歉，您访问的标签不存在。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">标签：{tag.name}</h1>
        <p className="text-muted-foreground">
          共 {filteredPosts.length} 篇文章
        </p>
      </div>

      <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
