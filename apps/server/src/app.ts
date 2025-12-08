//import dotenv from "dotenv";
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaLogger from 'koa-logger';
import logger from './utils/logger.js';
import serve from 'koa-static';
import path from 'path';
import { fileURLToPath } from 'url';
import ssrRouter from './routes/ssr.js';
import apiRouter from './routes/api.js';
import './utils/globalReact.js';

//dotenv.config({ path: "../../.env" }); // 如果用 import 'dotenv/config'，加载的是当前文件（node 运行目录）所在目录的 .env

const app = new Koa();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(
  koaLogger((str) => {
    logger.info(str.trim());
  })
);
app.use(bodyParser());

// 静态资源中间件 - 提供 web/public 目录下的静态文件
// 例如：favicon.ico, robots.txt, 图片等
app.use(
  serve(
    path.join(path.dirname(fileURLToPath(import.meta.url)), '../../web/public')
  )
);
app.use(
  serve(
    path.join(path.dirname(fileURLToPath(import.meta.url)), '../../web/dist'),
    { index: false }
  )
);

// API routes (must come before SSR catch-all)
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

// SSR routes (catch-all, must be last)
app.use(ssrRouter.routes());
app.use(ssrRouter.allowedMethods());

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

export default app;
