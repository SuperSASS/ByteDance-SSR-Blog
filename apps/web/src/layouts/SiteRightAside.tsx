import { SearchBox } from '@/components/blog/SearchBox';
import { ArchiveList } from '@/components/blog/ArchiveList';
import { TagCloud } from '@/components/blog/TagCloud';
import { Card, CardContent } from '@/components/ui/card';

export function SiteRightAside() {
  return (
    <aside className="w-80 h-screen sticky top-0 p-6 space-y-6 overflow-y-auto">
      <Card>
        <CardContent className="pt-6">
          <SearchBox />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <ArchiveList />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <TagCloud />
        </CardContent>
      </Card>
    </aside>
  );
}
