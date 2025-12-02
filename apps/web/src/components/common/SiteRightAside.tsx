import { SearchBox } from '@/components/blog/SearchBox';
import { ArchiveList } from '@/components/blog/ArchiveList';
import { TagCloud } from '@/components/blog/TagCloud';
import { Card, CardContent } from '@/components/ui/card';
import type { TagDto } from 'ssr-blog-shared';

interface SiteRightAsideProps {
  tags?: TagDto[];
  archives?: { year: number; count: number }[];
}

export function SiteRightAside({ tags, archives }: SiteRightAsideProps) {
  return (
    <aside className="w-80 h-screen sticky top-0 p-6 space-y-6 overflow-y-auto">
      <Card className="bg-card/50 backdrop-blur-sm border-muted/40">
        <CardContent className="pt-6">
          <SearchBox />
        </CardContent>
      </Card>

      {archives && archives.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-muted/40">
          <CardContent className="pt-6">
            <ArchiveList archives={archives} />
          </CardContent>
        </Card>
      )}

      {tags && tags.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-muted/40">
          <CardContent className="pt-6">
            <TagCloud tags={tags} />
          </CardContent>
        </Card>
      )}
    </aside>
  );
}
