import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-4">页面未找到</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        抱歉，您访问的页面不存在。可能是链接错误或页面已被删除。
      </p>
      <Link to="/">
        <Button>
          <Home className="mr-2 h-4 w-4" />
          返回首页
        </Button>
      </Link>
    </div>
  );
}
