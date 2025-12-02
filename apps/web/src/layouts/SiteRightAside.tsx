import { SearchBox } from '@/components/blog/SearchBox';
import { ArchiveList } from '@/components/blog/ArchiveList';
import { TagCloud } from '@/components/blog/TagCloud';
import { Card, CardContent } from '@/components/ui/card';

export function SiteRightAside() {
  return (
    <aside className="w-80 h-screen sticky top-0 p-6 space-y-6 overflow-y-auto">
      <Card className="bg-card/50 backdrop-blur-sm border-muted/40">
        <CardContent className="pt-6">
          <SearchBox />
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-muted/40">
        <CardContent className="pt-6">
          <ArchiveList />
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-muted/40">
        <CardContent className="pt-6">
          <TagCloud />
        </CardContent>
      </Card>
    </aside>
  );
}
