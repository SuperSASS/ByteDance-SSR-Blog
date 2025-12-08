import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function AdminUserListPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">用户管理</h1>

      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
          <CardDescription>
            管理系统用户,包括新建、编辑、删除和权限分配
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            此功能将在阶段 7 实现,包括用户的增删改查和权限管理。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
