import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function AdminCategoryListPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">分类管理</h1>

      <Card>
        <CardHeader>
          <CardTitle>分类列表</CardTitle>
          <CardDescription>管理文章分类,包括新建、编辑和删除</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            此功能将在阶段 7 实现,包括分类的增删改查。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
