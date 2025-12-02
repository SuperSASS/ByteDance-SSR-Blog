import { Link } from 'react-router-dom';

export function ArchiveList() {
  // TODO: 这里是 mock 数据，要替换
  const archives = [
    { year: 2024, count: 5 },
    { year: 2023, count: 12 },
  ];

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
