import 'dotenv/config';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
// import serve from 'koa-static';
// import path from 'path';
import ssrRouter from './routes/ssr.js';

const app = new Koa();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(bodyParser());

// 静态资源（后续会用到）
// app.use(serve(path.join(__dirname, '../web/dist')));

// API 路由

// SSR 路由
app.use(ssrRouter.routes());
app.use(ssrRouter.allowedMethods());

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 Stage 1: Minimal SSR SPA Skeleton`);
  console.log(`⏭️  Next: Stage 2 - Database & Prisma`);
});

export default app;
