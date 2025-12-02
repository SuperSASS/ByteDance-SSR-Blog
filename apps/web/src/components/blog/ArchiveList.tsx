import { Link } from 'react-router-dom';

interface ArchiveListProps {
  archives: { year: number; count: number }[];
}

export function ArchiveList({ archives }: ArchiveListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">归档</h3>
      <div className="space-y-2">
        {archives.map((archive) => (
          <Link
            key={archive.year}
            to={`/archives/${archive.year}`}
            className="flex justify-between items-center text-sm hover:text-primary transition-colors cursor-pointer"
          >
            <span>{archive.year} 年</span>
            <span className="text-muted-foreground">({archive.count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
