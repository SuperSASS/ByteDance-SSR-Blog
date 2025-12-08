import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function AdminTagListPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">标签管理</h1>

      <Card>
        <CardHeader>
          <CardTitle>标签列表</CardTitle>
          <CardDescription>管理文章标签,包括新建、编辑和删除</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            此功能将在阶段 7 实现,包括标签的增删改查。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
