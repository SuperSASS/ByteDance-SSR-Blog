import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Folder, Eye } from 'lucide-react';
import type { PostSummaryDto } from 'ssr-blog-shared';

interface PostCardProps {
  post: PostSummaryDto;
  costTime?: string;
  viewCount?: number;
}

export function PostCard({ post, costTime, viewCount }: PostCardProps) {
  return (
    <Link to={`/posts/${post.id}`} className="block group h-full">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col bg-card/50 backdrop-blur-sm border-muted/40">
        {post.coverImageUrl && (
          <div className="aspect-[16/6] overflow-hidden relative">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Category Badge over Image */}
            <div className="absolute top-3 left-3 z-10">
              <object>
                <Link to={`/categories/${post.category.id}`}>
                  <Badge
                    variant="default"
                    className="bg-primary/90 hover:bg-primary cursor-pointer"
                  >
                    <Folder className="w-3 h-3 mr-1" />
                    {post.category.name}
                  </Badge>
                </Link>
              </object>
            </div>
          </div>
        )}
        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <object key={tag.id}>
                <Link to={`/tags/${tag.id}`}>
                  <Badge
                    variant="secondary"
                    className="text-xs font-normal hover:bg-secondary/80 cursor-pointer"
                  >
                    {tag.name}
                  </Badge>
                </Link>
              </object>
            ))}
          </div>
          <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-muted-foreground mb-4 line-clamp-2 text-sm flex-1">
            {post.summary}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('zh-CN')
                : '未发布'}
            </span>
            {costTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {costTime}
              </span>
            )}
            {viewCount && (
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {viewCount}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
