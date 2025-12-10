import { useState, useEffect } from 'react';
import {
  Link,
  useNavigate,
  useLoaderData,
  useSubmit,
  useActionData,
} from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { PostSummaryDto } from 'ssr-blog-shared';
import { Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function AdminPostListPage() {
  const navigate = useNavigate();
  const posts = useLoaderData() as PostSummaryDto[];
  const submit = useSubmit();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const actionData = useActionData() as
    | { success?: boolean; message?: string }
    | undefined;

  // Handle action success (delete)
  useEffect(() => {
    if (actionData?.success) {
      toast.success('文章删除成功');
    } else if (actionData?.message) {
      toast.error(actionData.message);
    }
  }, [actionData]);

  const handleDelete = () => {
    if (deleteId) {
      const formData = new FormData();
      formData.append('id', deleteId.toString());
      submit(formData, { method: 'delete' });
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">文章管理</h1>
        <Button asChild>
          <Link to="/admin/posts/new">
            <Plus className="w-4 h-4 mr-2" />
            新建文章
          </Link>
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>标题</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>摘要</TableHead>
              <TableHead>发布时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  暂无文章
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.id}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.category.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {post.summary || '-'}
                  </TableCell>
                  <TableCell>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : '草稿'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/posts/${post.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Dialog
                        open={deleteId === post.id}
                        onOpenChange={(open) => !open && setDeleteId(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>确认删除</DialogTitle>
                            <DialogDescription>
                              此操作无法撤销。这将永久删除文章 "{post.title}"。
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                            >
                              确认删除
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
