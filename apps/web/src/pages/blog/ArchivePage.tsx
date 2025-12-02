import { useMemo } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { CategoryList } from '@/components/blog/CategoryList';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import type { CategoryDto, PostSummaryDto } from 'ssr-blog-shared';

export function ArchivePage() {
  const { categories, allPosts } = useLoaderData() as {
    categories: CategoryDto[];
    allPosts: PostSummaryDto[];
  };

  // Group posts by year
  const postsByYear = useMemo(() => {
    const groups: Record<number, PostSummaryDto[]> = {};
    allPosts.forEach((post) => {
      if (post.publishedAt) {
        const year = new Date(post.publishedAt).getFullYear();
        if (!groups[year]) {
          groups[year] = [];
        }
        groups[year].push(post);
      }
    });
    // Sort years descending
    return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [allPosts]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full" />
          分类
        </h2>
        <CategoryList categories={categories} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full" />
          归档
        </h2>

        <div className="space-y-8">
          {postsByYear.map(([year, posts]) => (
            <div key={year} className="relative pl-8 border-l-2 border-muted">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary" />
              <h3 className="text-3xl font-bold text-muted-foreground/50 mb-6 -mt-2">
                {year}
              </h3>

              <div className="space-y-4">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/posts/${post.id}`}
                    className="block group"
                  >
                    <Card className="hover:shadow-md transition-all duration-300 border-transparent hover:border-border bg-transparent hover:bg-card">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          {post.coverImageUrl && (
                            <img
                              src={post.coverImageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-medium truncate group-hover:text-primary transition-colors">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="w-3 h-3" />
                            {post.publishedAt &&
                              new Date(post.publishedAt).toLocaleDateString(
                                'zh-CN',
                                { month: 'short', day: 'numeric' }
                              )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
