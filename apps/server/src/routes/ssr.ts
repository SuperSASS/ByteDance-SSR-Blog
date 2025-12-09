import Router from '@koa/router';
import type Koa from 'koa';
import { htmlTemplate } from '../utils/htmlTemplate.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// 生产模式清单路径 (SSR 需要知道注入哪些客户端资源)
const MANIFEST_PATH = path.resolve(
  __dirname,
  '../../../web/dist/client/.vite/manifest.json'
);

interface ManifestEntry {
  file?: string;
  css?: string[];
}

type Manifest = Record<string, ManifestEntry>;

let manifest: Manifest | null = null;

/**
 * 从 manifest 中提取 CSS 文件路径（生产模式用）
 */
function getStyles(manifest: Manifest | null): string[] {
  if (manifest) {
    const srcEntry = manifest['index.html'];
    if (srcEntry && srcEntry.css) {
      return srcEntry.css.map((file: string) => `/${file}`);
    }
  }
  return [];
}

/**
 * 从 manifest 中提取 JS 文件路径（生产模式用）
 */
function getScripts(manifest: Manifest | null): string[] {
  if (manifest) {
    const srcEntry = manifest['index.html'];
    if (srcEntry && srcEntry.file) {
      return [`/${srcEntry.file}`];
    }
  }
  return [];
}

const router = new Router();

// 加载渲染函数
async function loadRender(ctx: Koa.Context) {
  if (ctx.state.vite) {
    // 开发模式：使用 Vite 转换并加载
    return (await ctx.state.vite.ssrLoadModule('/src/entry-server.tsx')).render;
  } else {
    // 生产模式：加载构建后的服务端入口
    // 动态导入以避免构建时依赖解析问题
    // @ts-expect-error - Dynamic import path resolved at runtime
    return (await import('../../../web/dist/server/entry-server.js')).render;
  }
}

// 页面 SSR API
router.get(/(.*)/, async (ctx: Koa.Context) => {
  try {
    const render = await loadRender(ctx);

    // 准备 Web Request 对象
    const baseUrl = process.env.BASE_URL || `${ctx.protocol}://${ctx.host}`;
    const fullUrl = `${baseUrl}${ctx.url}`;

    // 转换 Koa headers 为 HeadersInit 格式
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(ctx.headers)) {
      if (value !== undefined) {
        headers[key] = Array.isArray(value) ? value.join(', ') : value;
      }
    }

    const request = new Request(fullUrl, {
      method: ctx.method,
      headers,
    });

    // 执行 SSR 渲染
    const result = await render(request);

    // 处理响应结果（重定向等）
    if (result.type === 'response') {
      const response = result.response;
      ctx.status = response.status;

      if (response.status >= 300 && response.status < 400) {
        ctx.redirect(response.headers.get('Location') || '/');
        return;
      }

      ctx.body = await response.text();
      return;
    }

    // 生成 HTML
    let html: string;

    if (ctx.state.vite) {
      // ========== 开发模式 ==========
      // 使用 vite.transformIndexHtml 自动注入：
      // - 客户端入口脚本 (/src/entry-client.tsx)
      // - HMR 客户端
      // - Vite 预加载辅助脚本
      //
      // 注意：我们先生成基础 HTML（不包含客户端脚本），
      // 然后让 Vite 来注入所有需要的脚本和样式
      html = htmlTemplate(
        result.html,
        ['/src/index.css'],
        ['/src/entry-client.tsx']
      ); // ⭐这里必须带上'/src/entry-client.tsx'以在开发模式下注入客户端代码水合；同时还带上 CSS 解决 FOUC
      // 这里可以展示水合的作用 - 主题切换：
      // 如果不加上'/src/entry-client.tsx'，因为 React 没有接管，导致主题切换无法作用（虽然左侧导航页可用，但因为其就是普通导航逻辑，不需要水合，因此不水合只是部分交互失效、但页面正常）
      // 如果也不加上`/src/index.css`，则彻底没有 import css 导致无样式
      html = await ctx.state.vite.transformIndexHtml(ctx.url, html);
    } else {
      // ========== 生产模式 ==========
      // 从 manifest.json 读取构建后的资源文件路径
      // manifest 包含了带 hash 的文件名，确保缓存失效
      if (!manifest) {
        try {
          if (fs.existsSync(MANIFEST_PATH)) {
            manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
          }
        } catch (e) {
          console.error('Failed to load manifest:', e);
        }
      }

      const styles = getStyles(manifest);
      const scripts = getScripts(manifest);
      html = htmlTemplate(result.html, styles, scripts);
    }

    // ETag & 协商缓存
    const etag = crypto.createHash('md5').update(html).digest('hex');

    // 检查 If-None-Match
    if (ctx.get('If-None-Match') === etag) {
      ctx.status = 304;
      return;
    }

    ctx.set('ETag', etag);
    // 动态内容，使用 no-cache 配合 ETag 实现协商缓存
    // 这个告诉浏览器：使用缓存前必须要向服务器问问这个可不可以用（更新没），所以动态内容基本必须搭配这个，防止使用旧内容
    ctx.set('Cache-Control', 'no-cache');

    ctx.type = 'text/html';
    ctx.body = html;
  } catch (e) {
    if (ctx.state.vite) {
      ctx.state.vite.ssrFixStacktrace(e);
    }
    console.error('SSR Render Error:', e);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
});

export default router;
