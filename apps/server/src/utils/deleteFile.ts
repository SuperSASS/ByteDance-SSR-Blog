import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 从 URL 中提取上传文件的路径
 * @param url - 文件 URL (如 /uploads/1234567890-abc.jpg)
 * @returns 文件的绝对路径，如果不是上传文件则返回 null
 */
function getUploadFilePath(url: string | null): string | null {
  if (!url) return null;

  // 只处理 /uploads/ 开头的 URL
  if (!url.startsWith('/uploads/')) {
    return null;
  }

  // 提取文件名
  const filename = url.replace('/uploads/', '');

  // 构建绝对路径
  // 从 utils/ 目录向上两级到 server/，然后进入 uploads/
  const filePath = path.join(__dirname, '../../uploads', filename);

  return filePath;
}

/**
 * 删除上传的文件
 * @param url - 文件 URL
 * @returns 是否成功删除
 */
export async function deleteUploadedFile(url: string | null): Promise<boolean> {
  try {
    const filePath = getUploadFilePath(url);

    if (!filePath) {
      // 不是上传的文件（可能是外部 URL），不需要删除
      return false;
    }

    // 检查文件是否存在
    try {
      await fs.access(filePath);
    } catch {
      // 文件不存在，可能已经被删除
      console.warn(`File not found: ${filePath}`);
      return false;
    }

    // 删除文件
    await fs.unlink(filePath);
    console.log(`Deleted file: ${filePath}`);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}
