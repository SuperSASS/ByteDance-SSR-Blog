import { useEffect, useRef } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, Eye, Folder } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { PostDetailDto } from 'ssr-blog-shared';
import { postApi } from '@/services/api/post';

export function PostDetailPage() {
  const { post } = useLoaderData() as { post: PostDetailDto };
  const hasViewedRef = useRef(false);

  useEffect(() => {
    if (hasViewedRef.current) return;
    hasViewedRef.current = true;
    postApi.incrementView(post.id).catch(console.error);
  }, [post.id]);

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
              <Link to={`/categories/${post.category.id}`}>
                <Badge
                  variant="default"
                  className="bg-primary/90 hover:bg-primary cursor-pointer"
                >
                  <Folder className="w-3 h-3 mr-1" />
                  {post.category.name}
                </Badge>
              </Link>
            </div>

            <h1 className="text-4xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link key={tag.id} to={`/tags/${tag.id}`}>
                  <Badge
                    variant="secondary"
                    className="hover:bg-secondary/80 cursor-pointer"
                  >
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.publishedAt &&
                  new Date(post.publishedAt).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                阅读时间约 {post.readTime} 分钟
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
