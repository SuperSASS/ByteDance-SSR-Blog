import multer from '@koa/multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 上传路径和文件名
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads')); // 上传目录（在部署时，这个路径可能要修改）
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname); // .png\
    const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).slice(2);
    cb(null, uniqueSuffix + ext);
  },
});

// 配置 multer
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
