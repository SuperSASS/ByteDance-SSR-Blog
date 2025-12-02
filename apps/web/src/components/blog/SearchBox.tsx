import { Search } from 'lucide-react';

export function SearchBox() {
  // TODO: 没有逻辑
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">搜索</h3>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="搜索文章..."
          className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}
