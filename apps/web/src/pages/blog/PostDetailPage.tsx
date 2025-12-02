import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, Eye, Folder } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { mockPosts } from '@/mock/posts';

export function PostDetailPage() {
  const { id } = useParams();
  const post = mockPosts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">文章未找到</h1>
        <p className="text-muted-foreground">抱歉，您访问的文章不存在。</p>
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto overflow-hidden">
      {/* Cover Image */}
      {post.coverImageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardContent className="p-8 md:p-10">
        <article>
          {/* Title and Meta */}
          <header className="mb-8 border-b pb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant="default"
                className="bg-primary/90 hover:bg-primary"
              >
                <Folder className="w-3 h-3 mr-1" />
                {post.category.name}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime} 分钟阅读
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.views} 次阅读
              </span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </CardContent>
    </Card>
  );
}
