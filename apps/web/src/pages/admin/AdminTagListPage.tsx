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
import type { TagDto } from 'ssr-blog-shared';
import { Edit, Trash2, Plus } from 'lucide-react';

export function AdminTagListPage() {
  const tags = useLoaderData() as TagDto[];
  const fetcher = useFetcher();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagDto | null>(null);

  const [formData, setFormData] = useState({ name: '', slug: '' });

  const isSubmitting = fetcher.state === 'submitting';

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (
      fetcher.state === 'idle' &&
      fetcher.data &&
      (fetcher.data as { success?: boolean }).success
    ) {
      setIsDialogOpen(false);
      setEditingTag(null);
      setFormData({ name: '', slug: '' });
    }
  }, [fetcher.state, fetcher.data]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const openCreateDialog = () => {
    setEditingTag(null);
    setFormData({ name: '', slug: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (tag: TagDto) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, slug: tag.slug });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('确认删除该标签吗？')) {
      fetcher.submit(
        { intent: 'delete', id: id.toString() },
        { method: 'post' }
      );
    }
  };

  const handleSave = () => {
    const data: Record<string, string> = {
      intent: editingTag ? 'update' : 'create',
      name: formData.name,
      slug: formData.slug,
    };
    if (editingTag) {
      data.id = editingTag.id.toString();
    }
    fetcher.submit(data, { method: 'post' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">标签管理</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          新建标签
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
            {tags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  暂无标签
                </TableCell>
              </TableRow>
            ) : (
              tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">{tag.id}</TableCell>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>{tag.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(tag)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(tag.id)}
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
            <DialogTitle>{editingTag ? '编辑标签' : '新建标签'}</DialogTitle>
            <DialogDescription>
              请输入标签名称和 Slug（URL 路径）。
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
