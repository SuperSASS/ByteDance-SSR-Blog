import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">仪表盘</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>文章总数</CardTitle>
            <CardDescription>已发布的文章数量</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">-</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>分类总数</CardTitle>
            <CardDescription>文章分类数量</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">-</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>标签总数</CardTitle>
            <CardDescription>文章标签数量</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">-</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>用户总数</CardTitle>
            <CardDescription>注册用户数量</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">-</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>欢迎使用博客后台管理系统</CardTitle>
          <CardDescription>
            这是阶段 6 的占位页面,具体功能将在阶段 7 实现
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            您可以通过左侧菜单访问各个管理模块。目前各模块仅为占位页面,完整功能将在下一阶段开发。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
