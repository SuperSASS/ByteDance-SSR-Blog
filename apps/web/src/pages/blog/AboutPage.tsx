import { Card, CardContent } from '@/components/ui/card';

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">关于我</h1>
            <p className="text-muted-foreground">欢迎来到我的个人博客！</p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2>关于本站</h2>
            <p>
              这是一个基于 React 19、Koa 3 和 Prisma 构建的服务端渲染博客系统。
            </p>

            <h2>技术栈</h2>
            <ul>
              <li>
                前端：React 19 + React Router 7 + shadcn/ui + Tailwind CSS
              </li>
              <li>后端：Koa 3 + Prisma + SQLite</li>
              <li>部署：待定</li>
            </ul>

            <h2>联系方式</h2>
            <p>如果您有任何问题或建议，欢迎通过以下方式联系我：</p>
            <ul>
              <li>Email: example@example.com</li>
              <li>GitHub: @example</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
