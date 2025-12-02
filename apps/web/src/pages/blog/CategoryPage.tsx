import { useParams } from 'react-router-dom';
import { PostCard } from '@/components/blog/PostCard';
import { mockPosts } from '@/mock/posts';
import { Folder } from 'lucide-react';

export function CategoryPage() {
  const { id } = useParams();
  const categoryId = Number(id);

  const category = mockPosts.find(
    (p) => p.category.id === categoryId
  )?.category;
  const posts = mockPosts.filter((post) => post.category.id === categoryId);

  if (!category) {
    return <div className="text-center py-10">分类不存在</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center py-10 bg-card rounded-lg border shadow-sm">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
          <Folder className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-muted-foreground">共 {posts.length} 篇文章</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
