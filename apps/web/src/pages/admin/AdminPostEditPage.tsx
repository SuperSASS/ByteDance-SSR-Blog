import { useState, useEffect } from 'react';
import {
  useNavigate,
  useLoaderData,
  Form,
  useNavigation,
  useActionData,
} from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MarkdownEditor } from '@/components/markdown/MarkdownEditor';
import { ImageUpload } from '@/components/common/ImageUpload';
import type { CategoryDto, PostDetailDto, TagDto } from 'ssr-blog-shared';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface LoaderData {
  categories: CategoryDto[];
  tags: TagDto[];
  post: PostDetailDto | null;
}

export function AdminPostEditPage() {
  const { categories, tags, post } = useLoaderData() as LoaderData;
  const navigate = useNavigate();
  const actionData = useActionData() as
    | { success: boolean; redirect: string }
    | undefined;
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';
  const isEdit = !!post;

  const [content, setContent] = useState(post?.content || '');
  const [categoryId, setCategoryId] = useState(
    post?.category.id.toString() || ''
  );
  const [publishedAt, setPublishedAt] = useState(
    post?.publishedAt
      ? new Date(post.publishedAt).toISOString().slice(0, 16)
      : ''
  );
  // Initialize selected tags
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    post?.tags.map((t) => t.id) || []
  );
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl || '');

  useEffect(() => {
    if (actionData) {
      toast.success(isEdit ? '文章更新成功' : '文章创建成功');
      navigate(actionData.redirect);
    }
  }, [actionData, isEdit, navigate]);

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div key={post?.id ?? 'new'} className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/posts')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? '编辑文章' : '新建文章'}
        </h1>
      </div>

      <Form method="post" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              name="title"
              defaultValue={post?.title}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL 路径)</Label>
            <Input id="slug" name="slug" defaultValue={post?.slug} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">分类</Label>
            <input type="hidden" name="categoryId" value={categoryId} />
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>标签</Label>
            <div className="flex flex-wrap gap-2 border p-2 rounded-md min-h-[40px]">
              {tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <Badge
                    key={tag.id}
                    variant={isSelected ? 'default' : 'outline'}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                );
              })}
            </div>
            {selectedTagIds.map((id) => (
              <input key={id} type="hidden" name="tagIds" value={id} />
            ))}
          </div>

          <div className="space-y-2">
            <ImageUpload
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              label="封面图"
            />
            <input type="hidden" name="coverImageUrl" value={coverImageUrl} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishedAt">发布时间</Label>
            <Input
              id="publishedAt"
              name="publishedAt"
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
            <p className="text-xs text-gray-500">留空则为草稿</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">摘要</Label>
          <Input
            id="summary"
            name="summary"
            defaultValue={post?.summary || ''}
          />
        </div>

        <div className="space-y-2">
          <Label>内容 (Markdown)</Label>
          <input type="hidden" name="content" value={content} />
          <MarkdownEditor
            value={content}
            onChange={(val) => setContent(val || '')}
            height={500}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/posts')}
          >
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '保存中...' : '保存文章'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
