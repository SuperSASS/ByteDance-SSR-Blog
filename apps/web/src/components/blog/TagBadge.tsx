import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface TagBadgeProps {
  name: string;
  slug: string;
  clickable?: boolean;
}

export function TagBadge({ name, slug, clickable = true }: TagBadgeProps) {
  if (clickable) {
    return (
      <Link to={`/tags/${slug}`}>
        <Badge
          variant="secondary"
          className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
        >
          {name}
        </Badge>
      </Link>
    );
  }

  return <Badge variant="secondary">{name}</Badge>;
}
