import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Folder } from 'lucide-react';
import type { CategoryDto } from 'ssr-blog-shared';

interface CategoryListProps {
  categories: CategoryDto[];
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/categories/${category.id}`}
          className="block group"
        >
          <div className="relative overflow-hidden rounded-lg bg-card border hover:shadow-md transition-all duration-300 h-24 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex flex-col items-center gap-2 z-10">
              <div className="flex items-center gap-2 text-lg font-semibold group-hover:text-primary transition-colors">
                <Folder className="w-5 h-5" />
                {category.name}
              </div>
              {category.postCount !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  {category.postCount} 篇文章
                </Badge>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
