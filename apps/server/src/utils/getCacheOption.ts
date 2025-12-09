/**
 * 静态资源缓存配置
 *
 * 缓存策略：
 * 1. 带 hash 的资源（如 index-abc123.js）：强缓存 1 年 + immutable
 * 2. 图片、字体：强缓存 30 天
 * 3. 其他静态资源（favicon 等）：强缓存 7 天
 * 4. HTML 文件：协商缓存（由 SSR 路由处理）
 */

interface CacheConfig {
  maxAge: number; // 缓存时长（秒）
  immutable?: boolean; // 是否标记为 immutable
  public?: boolean; // 是否允许公共缓存
}

// 缓存配置映射
const CACHE_CONFIGS: Record<string, CacheConfig> = {
  // 带 hash 的构建产物（JS、CSS）- 永久缓存
  hashed: {
    maxAge: 31536000, // 1 年
    immutable: true,
    public: true,
  },
  // 图片资源
  images: {
    maxAge: 2592000, // 30 天
    public: true,
  },
  // 字体资源
  fonts: {
    maxAge: 2592000, // 30 天
    public: true,
  },
  // 其他静态资源（favicon、manifest 等）
  static: {
    maxAge: 604800, // 7 天
    public: true,
  },
  // 上传的用户内容
  uploads: {
    maxAge: 2592000, // 30 天
    public: true,
  },
};

/**
 * 判断文件类型
 */
function getAssetType(filePath: string): keyof typeof CACHE_CONFIGS {
  const path = filePath.toLowerCase();

  // 带 hash 的文件（Vite 构建产物）
  // 格式：index-abc123.js, style-def456.css
  if (
    /\/assets\/[^/]+-[a-f0-9]{8,}\.(js|css|woff2?|ttf|eot|svg|png|jpe?g|gif|webp)$/i.test(
      path
    )
  ) {
    return 'hashed';
  }

  // 图片文件
  if (/\.(png|jpe?g|gif|webp|svg|ico|avif)$/i.test(path)) {
    return 'images';
  }

  // 字体文件
  if (/\.(woff2?|ttf|eot|otf)$/i.test(path)) {
    return 'fonts';
  }

  // 上传的文件
  if (path.includes('/uploads/')) {
    return 'uploads';
  }

  // 其他静态资源
  return 'static';
}

/**
 * 生成 Cache-Control 头
 */
function generateCacheControl(config: CacheConfig): string {
  const parts: string[] = [];

  if (config.public) {
    parts.push('public');
  }

  parts.push(`max-age=${config.maxAge}`);

  if (config.immutable) {
    parts.push('immutable');
  }

  return parts.join(', ');
}

/**
 * 生成 Expires 头
 */
function generateExpires(maxAge: number): string {
  const expiresDate = new Date(Date.now() + maxAge * 1000);
  return expiresDate.toUTCString();
}

/**
 * koa-static 的 cache 配置
 */
export const setHeaders = (res: any, filePath: string) => {
  const actualType = getAssetType(filePath);
  const actualConfig = CACHE_CONFIGS[actualType];

  // 设置 Cache-Control
  res.setHeader('Cache-Control', generateCacheControl(actualConfig));

  // 设置 Expires
  res.setHeader('Expires', generateExpires(actualConfig.maxAge));

  // hashed 类型特殊处理
  if (actualType === 'hashed') {
    res.setHeader('Vary', 'Accept-Encoding');
  }
};
