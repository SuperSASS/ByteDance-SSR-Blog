import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye } from 'lucide-react';
import type { MockPost } from '@/mock/posts';

interface PostCardProps {
  // TODO: 这里用到了 Mock 要替换
  post: MockPost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link to={`/posts/${post.id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {post.coverImageUrl && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {post.summary}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime} 分钟
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
