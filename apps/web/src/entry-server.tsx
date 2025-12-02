import ReactDOMServer from 'react-dom/server';
import { createStaticHandler, createStaticRouter } from 'react-router-dom';
import { routes } from './routes/routes';
import { AppShell } from './app/AppShell';

/**
 * SSR渲染函数
 * @param request - Web Standard Request对象
 * @returns 渲染后的HTML字符串和context
 */
export async function render(request: Request) {
  // 1. 创建Static Handler
  const handler = createStaticHandler(routes);

  // 2. 执行所有loader，获取context
  const context = await handler.query(request);

  // 3. 如果是重定向或错误响应（此时context 返回的是 Response 对象），直接返回
  if (context instanceof Response) {
    return { type: 'response' as const, response: context };
  }

  // 4. 创建Static Router
  const router = createStaticRouter(handler.dataRoutes, context);

  // 5. 渲染React组件为HTML
  const appHtml = ReactDOMServer.renderToString(
    <AppShell type="server" router={router} context={context} />
  );

  return {
    type: 'html' as const,
    html: appHtml,
    context,
  };
}
