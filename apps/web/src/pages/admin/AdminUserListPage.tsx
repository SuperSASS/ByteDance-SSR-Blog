import { useState, useEffect } from 'react';
import { useLoaderData, useFetcher } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Role, UserDto, CategoryDto } from 'ssr-blog-shared';
import { Edit, Trash2, Plus, Shield } from 'lucide-react';
import { permissionApi } from '@/services/api/permission';

interface LoaderData {
  users: UserDto[];
  categories: CategoryDto[];
}

export function AdminUserListPage() {
  const { users, categories } = useLoaderData() as LoaderData;
  const fetcher = useFetcher();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER' as Role,
  });

  // Permission Dialog State
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [permissionUser, setPermissionUser] = useState<UserDto | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [initialCategoryIds, setInitialCategoryIds] = useState<number[]>([]);
  const [isPermissionLoading, setIsPermissionLoading] = useState(false);

  const isSubmitting = fetcher.state === 'submitting';

  useEffect(() => {
    if (
      fetcher.state === 'idle' &&
      fetcher.data &&
      (fetcher.data as { success?: boolean }).success
    ) {
      setIsDialogOpen(false);
      setEditingUser(null);
      setFormData({ username: '', email: '', password: '', role: 'USER' });
    }
  }, [fetcher.state, fetcher.data]);

  const openCreateDialog = () => {
    setEditingUser(null);
    setFormData({ username: '', email: '', password: '', role: 'USER' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: UserDto) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  const openPermissionDialog = async (user: UserDto) => {
    setPermissionUser(user);
    setIsPermissionDialogOpen(true);
    setSelectedCategoryIds([]);
    setInitialCategoryIds([]);
    setIsPermissionLoading(true); // Ensure loading state is true
    try {
      const perms = await permissionApi.getUserPermissions(user.id);

      const ids = perms.map((c) => c.categoryId);
      setSelectedCategoryIds(ids);
      setInitialCategoryIds(ids);
    } catch (e) {
      console.error('Failed to fetch permissions', e);
      // Optional: Toast error here
    } finally {
      setIsPermissionLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('确认删除该用户吗？')) {
      fetcher.submit(
        { intent: 'delete', id: id.toString() },
        { method: 'post' }
      );
    }
  };

  const handleSave = () => {
    // fetcher.submit expects generic object values to be strings or Blobs
    const data: Record<string, string> = {
      intent: editingUser ? 'update' : 'create',
      username: formData.username,
      email: formData.email,
      role: formData.role,
      password: formData.password,
    };
    if (editingUser) {
      data.id = editingUser.id.toString();
    }
    fetcher.submit(data, { method: 'post' });
  };

  const handleSavePermissions = async () => {
    if (!permissionUser) return;
    setIsPermissionLoading(true);
    try {
      const toAdd = selectedCategoryIds.filter(
        (id) => !initialCategoryIds.includes(id)
      );
      const toRemove = initialCategoryIds.filter(
        (id) => !selectedCategoryIds.includes(id)
      );

      await Promise.all([
        ...toAdd.map((catId) =>
          permissionApi.grantPermission(permissionUser.id, catId)
        ),
        ...toRemove.map((catId) =>
          permissionApi.revokePermission(permissionUser.id, catId)
        ),
      ]);
      setIsPermissionDialogOpen(false);
    } catch (e) {
      console.error('Failed to save permissions', e);
      alert('保存权限失败');
    } finally {
      setIsPermissionLoading(false);
    }
  };

  const toggleCategory = (catId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">用户管理</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          新建用户
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>用户名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>角色</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  暂无用户
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      {user.role === 'EDITOR' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openPermissionDialog(user)}
                          title="管理权限"
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? '编辑用户' : '新建用户'}</DialogTitle>
            <DialogDescription>请输入用户信息。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                密码 {editingUser && '(留空则不修改)'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!editingUser}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">角色</Label>
              <Select
                value={formData.role}
                onValueChange={(val) =>
                  setFormData({ ...formData, role: val as Role })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">管理员</SelectItem>
                  <SelectItem value="EDITOR">编辑</SelectItem>
                  <SelectItem value="USER">普通用户</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                取消
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? '保存' : '保存'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isPermissionDialogOpen}
        onOpenChange={setIsPermissionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              管理可编辑分类: {permissionUser?.username}
            </DialogTitle>
            <DialogDescription>
              选择该用户可以管理的分类。管理员默认拥有所有权限。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            {isPermissionLoading && <p>加载中...</p>}
            {!isPermissionLoading &&
              categories.map((cat) => (
                <div key={cat.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`perm-${cat.id}`}
                    checked={selectedCategoryIds.includes(cat.id)}
                    onCheckedChange={() => toggleCategory(cat.id)}
                  />
                  <Label htmlFor={`perm-${cat.id}`}>{cat.name}</Label>
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPermissionDialogOpen(false)}
            >
              取消
            </Button>
            <Button
              onClick={handleSavePermissions}
              disabled={isPermissionLoading}
            >
              保存权限
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
