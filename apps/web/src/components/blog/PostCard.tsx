import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, Folder } from 'lucide-react';
import type { Post } from '@/types/blog';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link to={`/posts/${post.id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {post.coverImageUrl && (
          <div className="aspect-[16/6] overflow-hidden relative">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Category Badge over Image */}
            <div className="absolute top-3 left-3">
              <Badge
                variant="default"
                className="bg-primary/90 hover:bg-primary"
              >
                <Folder className="w-3 h-3 mr-1" />
                {post.category.name}
              </Badge>
            </div>
          </div>
        )}
        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Show tags if needed, or maybe just keep them minimal since category is emphasized */}
            {post.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs font-normal"
              >
                {tag.name}
              </Badge>
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
              {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTime} 分钟
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {post.views}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
