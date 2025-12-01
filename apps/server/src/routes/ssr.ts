import Router from '@koa/router';
import type Koa from 'koa';
import { htmlTemplate } from '../utils/htmlTemplate.js';

const router = new Router();

// 给 render 定一个 TypeScript 类型（方便 IDE 补全）：
type RenderFn = (url: string, initialData: any) => string | Promise<string>;

/**
 * 注意：这里用的是“运行时动态导入”，而不是顶层 import。
 * 为了绕开 TS 对 .tsx 扩展名、rootDir、moduleResolution 的各种限制，
 * 我们故意把 '.tsx' 拼接在字符串里，让 TS 静态分析不到这个真实路径。
 */
async function loadRender(): Promise<RenderFn> {
  const mod = (await import(
    // 这行字符串在编译期对 TypeScript 来说只是一个“不透明”的表达式
    '../../../web/src/entry-server' + '.tsx'
  )) as any;

  // 这里假设 entry-server.tsx 默认导出了名为 render 的函数
  return mod.render as RenderFn;
}

router.get(/(.*)/, async (ctx: Koa.Context) => {
  const url = ctx.path;
  // Temporary: no data fetching yet
  // 日后更改为 fetchDataForUrl(url) 获取 url 对应的数据；再进一步更改为通过 loader 获取。
  const initialData = {};

  try {
    const render = await loadRender();
    const appHtml = await render(url, initialData);

    ctx.type = 'text/html';
    ctx.body = htmlTemplate(appHtml, initialData);
  } catch (e) {
    console.error('SSR Render Error:', e);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
});

export default router;
