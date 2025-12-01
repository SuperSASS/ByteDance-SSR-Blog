import 'dotenv/config';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
// import serve from 'koa-static';
// import path from 'path';

const app = new Koa();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(bodyParser());

// 静态资源（后续会用到）
// app.use(serve(path.join(__dirname, '../web/dist')));

// 基础路由（临时，阶段 1 会改为 SSR 路由）
app.use(async (ctx) => {
  ctx.body = {
    message: 'SSR Blog Server - 阶段 0 完成',
    stage: 'Stage 0: Project Scaffolding',
    nextStage: 'Stage 1: Minimal SSR SPA Skeleton',
    timestamp: new Date().toISOString(),
  };
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 Stage 0: Project scaffolding completed`);
  console.log(`⏭️  Next: Stage 1 - Implement SSR`);
});

export default app;
