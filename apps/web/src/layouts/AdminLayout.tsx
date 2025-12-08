import { Outlet, Link, useNavigate, useLoaderData } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  Users,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AuthUserDto } from 'ssr-blog-shared';
import * as authService from '@/services/auth.client';

const convertRoleToString = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return '管理员';
    case 'EDITOR':
      return '编辑';
    case 'USER':
      return '普通用户';
    default:
      return '未知角色';
  }
};

export function AdminLayout() {
  const navigate = useNavigate();
  const user = useLoaderData() as AuthUserDto;

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: '仪表盘' },
    { path: '/admin/posts', icon: FileText, label: '文章管理' },
    { path: '/admin/categories', icon: FolderOpen, label: '分类管理' },
    { path: '/admin/tags', icon: Tags, label: '标签管理' },
    { path: '/admin/users', icon: Users, label: '用户管理' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 左侧导航栏 */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">博客后台</h1>
        </div>
        <nav className="mt-6 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-3">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.username}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {convertRoleToString(user.role)}
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </div>
      </aside>

      {/* 右侧内容区 */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
