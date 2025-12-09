import { useLoaderData } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { DashboardStats, PermissionData } from '@/services/api/dashboard';

interface LoaderData {
  stats: DashboardStats;
  permissions: PermissionData;
}

export function AdminDashboardPage() {
  const { stats, permissions } = useLoaderData() as LoaderData;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        仪表盘
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>文章总数</CardTitle>
            <CardDescription>已发布的文章数量</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.posts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>分类总数</CardTitle>
            <CardDescription>文章分类数量</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.categories}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>标签总数</CardTitle>
            <CardDescription>文章标签数量</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.tags}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>用户总数</CardTitle>
            <CardDescription>注册用户数量</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.users}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>权限概览</CardTitle>
            <CardDescription>您当前拥有的管理权限</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">分类编辑权限:</h3>
                {permissions.isAdmin ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    所有分类 (管理员)
                  </span>
                ) : permissions.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {permissions.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">暂无分类权限</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
