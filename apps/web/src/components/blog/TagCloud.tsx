import { Link } from 'react-router-dom';
import { mockTags } from '@/mock/tags';

export function TagCloud() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">标签云</h3>
      <div className="flex flex-wrap gap-2">
        {mockTags.map((tag) => (
          <Link
            key={tag.id}
            to={`/tags/${tag.id}`}
            className="inline-block px-3 py-1 text-sm rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
