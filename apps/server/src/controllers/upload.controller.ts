import type { Context } from 'koa';

// 允许的图片类型
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// 最大文件大小 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const uploadController = {
  /**
   * 上传图片
   */
  async uploadImage(ctx: Context) {
    try {
      // 检查是否有文件（由 multer 处理）
      if (!ctx.file) {
        ctx.status = 400;
        ctx.body = { error: '请选择要上传的文件' };
        return;
      }

      const file = ctx.file;

      // 验证文件类型
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        ctx.status = 400;
        ctx.body = {
          error: '不支持的文件类型，仅支持 JPG、PNG、GIF、WebP、SVG 格式',
        };
        return;
      }

      // 验证文件大小
      if (file.size > MAX_FILE_SIZE) {
        ctx.status = 400;
        ctx.body = { error: '文件大小不能超过 5MB' };
        return;
      }

      // 文件已经被 multer 保存到 uploads/ 目录
      // 生成访问 URL
      const fileUrl = `/uploads/${file.filename}`;

      ctx.status = 200;
      ctx.body = {
        url: fileUrl,
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
      };
    } catch (error) {
      console.error('Upload error:', error);
      ctx.status = 500;
      ctx.body = { error: '文件上传失败' };
    }
  },
};
