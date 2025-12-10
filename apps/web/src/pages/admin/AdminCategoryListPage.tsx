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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CategoryDto } from 'ssr-blog-shared';
import { Edit, Trash2, Plus } from 'lucide-react';

export function AdminCategoryListPage() {
  const categories = useLoaderData() as CategoryDto[];
  const fetcher = useFetcher();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(
    null
  );

  const [formData, setFormData] = useState({ name: '', slug: '' });

  const isSubmitting = fetcher.state === 'submitting';

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    // Determine success based on fetcher state transition to idle with success data
    if (
      fetcher.state === 'idle' &&
      fetcher.data &&
      (fetcher.data as { success?: boolean }).success
    ) {
      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '' });
    }
  }, [fetcher.state, fetcher.data]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: CategoryDto) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (
      confirm('确认删除该分类吗？将会删除该分类下所有文章！此操作不可恢复。')
    ) {
      fetcher.submit(
        { intent: 'delete', id: id.toString() },
        { method: 'post' }
      );
    }
  };

  const handleSave = () => {
    const data: Record<string, string> = {
      intent: editingCategory ? 'update' : 'create',
      name: formData.name,
      slug: formData.slug,
    };
    if (editingCategory) {
      data.id = editingCategory.id.toString();
    }
    fetcher.submit(data, { method: 'post' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">分类管理</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          新建分类
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  暂无分类
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(category.id)}
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
            <DialogTitle>
              {editingCategory ? '编辑分类' : '新建分类'}
            </DialogTitle>
            <DialogDescription>
              请输入分类名称和 Slug（URL 路径）。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                名称
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">
                Slug
              </label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
              />
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
                {isSubmitting ? '保存中...' : '保存'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
