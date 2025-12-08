import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function AdminPostListPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">文章管理</h1>

      <Card>
        <CardHeader>
          <CardTitle>文章列表</CardTitle>
          <CardDescription>管理所有文章,包括新建、编辑和删除</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            此功能将在阶段 7 实现,包括文章列表展示、Markdown 编辑器等。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
