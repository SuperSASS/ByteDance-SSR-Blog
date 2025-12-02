import Router from '@koa/router';
import type Koa from 'koa';
import { htmlTemplate } from '../utils/htmlTemplate.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.resolve(
  __dirname,
  '../../../web/dist/.vite/manifest.json'
);

let manifest: Record<string, any> | null = null;

function getStyles(): string[] {
  if (!manifest) {
    try {
      if (fs.existsSync(MANIFEST_PATH)) {
        manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
      }
    } catch (e) {
      console.error('Failed to load manifest:', e);
    }
  }

  if (manifest) {
    const entry = manifest['index.html'];
    if (entry && entry.css) {
      return entry.css.map((file: string) => `/${file}`);
    }
  }
  return [];
}

const router = new Router();

// 动态导入entry-server.tsx的render函数
async function loadRender() {
  const mod = (await import('../../../web/src/entry-server' + '.tsx')) as any;
  return mod.render;
}

// 页面 SSR API
router.get(/(.*)/, async (ctx: Koa.Context) => {
  try {
    // 1. 加载render函数
    const render = await loadRender();

    // 2. 将Koa request转换为Web Standard Request
    // 动态构建完整URL,支持不同环境部署
    // 优先使用环境变量 BASE_URL,否则从请求头中获取
    const baseUrl = process.env.BASE_URL || `${ctx.protocol}://${ctx.host}`;
    const fullUrl = `${baseUrl}${ctx.url}`;

    const request = new Request(fullUrl, {
      method: ctx.method,
      headers: ctx.headers as any,
    });

    // 3. 调用render函数
    const result = await render(request);

    // 4. 处理不同类型的结果
    if (result.type === 'response') {
      // 处理重定向或错误响应
      const response = result.response;
      ctx.status = response.status;

      if (response.status >= 300 && response.status < 400) {
        ctx.redirect(response.headers.get('Location') || '/');
        return;
      }

      ctx.body = await response.text();
      return;
    }

    // 5. 正常渲染HTML
    const styles = getStyles();
    ctx.type = 'text/html';
    ctx.body = htmlTemplate(result.html, result.context, styles);
  } catch (e) {
    console.error('SSR Render Error:', e);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
});

export default router;
