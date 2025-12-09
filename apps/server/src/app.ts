//import dotenv from "dotenv";
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaLogger from 'koa-logger';
import logger from './utils/logger.js';
import serve from 'koa-static';
import mount from 'koa-mount';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import ssrRouter from './routes/ssr.js';
import apiRouter from './routes/api.js';
import koaConnect from 'koa-connect';
import './utils/globalReact.js';
import { setHeaders } from './utils/getCacheOption.js';

//dotenv.config({ path: "../../.env" }); // 如果用 import 'dotenv/config'，加载的是当前文件（node 运行目录）所在目录的 .env

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = new Koa();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV === 'development';

// 中间件
// 1. 日志
app.use(
  koaLogger((str) => {
    logger.info(str.trim());
  })
);

// 2. bodyParser
app.use(bodyParser());

// 3. 静态资源处理策略
if (isDev) {
  // --- Development Mode (Vite Middleware) ---
  console.log('🚀 Starting in Development Mode (Vite Middleware)');

  // 动态导入 vite，避免生产环境依赖
  // 注意：apps/server/package.json 需要 devDependencies 安装 vite
  const vite = await import('vite');

  const viteServer = await vite.createServer({
    root: path.resolve(__dirname, '../../web'),
    server: {
      middlewareMode: true,
      hmr: {
        // 让 Vite 的 HMR WebSocket 走 Koa 的 http server
        // 但 Koa server 是在 app.listen 启动的
        // 实际上 vite.createServer 在 middlewareMode 下会自动处理部分逻辑
        // 我们这里不需要显式 bind server，除非有复杂 websocket 需求
      },
    },
    appType: 'custom',
  });

  // 将 vite 实例挂载到 context，供 SSR 路由使用
  app.use(async (ctx, next) => {
    ctx.state.vite = viteServer;
    await next();
  });

  // 使用 koa-connect 转换 Vite 中间件
  app.use(koaConnect(viteServer.middlewares));
} else {
  // --- Production Mode (Static Files) ---
  console.log('🚀 Starting in Production Mode (Static Files)');

  // 托管 web/dist/client (构建产物)，策略根据文件类型决定
  app.use(
    serve(path.join(__dirname, '../../web/dist/client'), {
      index: false, // 不自动 serve index.html，交给 SSR 处理
      setHeaders,
    })
  );
}

// 4. 上传文件目录 (Dev & Prod)
const uploadDir = path.join(__dirname, '../uploads'); // 指向 apps/server/uploads
app.use(mount('/uploads', serve(uploadDir, { setHeaders })));

// 5. API routes (must come before SSR catch-all)
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

// 6. SSR routes (catch-all, must be last)
app.use(ssrRouter.routes());
app.use(ssrRouter.allowedMethods());

// 只有当直接运行 app.ts 时才启动监听 (便于测试或作为模块导出)
// 注意：pnpm dev 运行的是 tsx src/app.ts，所以会执行到这里
if (
  import.meta.url === pathToFileURL(process.argv[1]).href ||
  process.argv[1].endsWith('app.ts')
) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

export default app;
