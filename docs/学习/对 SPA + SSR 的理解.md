# 对 SPA + SSR 的理解

## SPA（CSR）

SPA，单页面应用，核心就是：  
**点击页面内的链接**，不会获取新的 HTML 页面并替换当前页面（丢弃旧页面，加载新页面），而是**在同一个页面（HTML）内**，通过 JS 渲染新组件。  
因此用户不会感受到像刷新那样的页面一白再出现，而是平滑的切换。

![SPA 与传统(MPA)区别](<images/image-对 SPA 的理解.png>)

### 核心实现：React Router

可以说，React Router 就是专为 SPA 构建的“前端应用内路由系统”，两者强绑定。  
如果不使用 SPA（用 MPA），则不需要 React Router。

传统的 MPA，页面路由只由服务器负责，访问什么 URL 则提供什么 HTML 页面：

```bash
/home → Web 服务器返回 home.html（是 React build 产生的，下同）
/posts → Web 服务器返回 posts.html
/posts/1 → Web 服务器返回 post_detail.html
```

而 SPA，则只有一个`index.html`，以及带 React Router 的 js bundle 文件。  
页面路由由 React Router 负责，访问什么 URL 则提供什么组件（页面 Page）：

```bash
/home    → Web 服务器返回 index.html，其中加载 HomePage 页面
/posts   → Web 服务器返回 index.html，其中加载 PostsPage 页面
/posts/1 → Web 服务器返回 index.html，其中加载 PostDetailPage 页面
```

### 核心机制：History API

浏览器提供的 History API：

```js
history.pushState(state, title, url);
```

能够让地址栏 URL 进行修改，但不会刷新、主动触发网络请求（但页面里获取数据时可能自行触发请求）。

React Router 的 `<Link>` 就是在内部调用 `pushState` 然后重新渲染 UI。  
其本质就是`<a>`，但会阻止默认行为，并调用`pushState`、然后用`rerenderMatchedComponent();`重新渲染 UI。  
是“假跳转 + 重新渲染”。

> 拓展 - HashRouter：
>
> 在 History API 出现之前，React Router 是基于 Hash 的，即 URL 中的`#`部分。  
> 所以如果有兼容性考虑，则用 HashRouter。否则可无脑用 BrowserRouter（基于 History API）。

### 站内点击链接 / 地址栏输入 URL 的不同表现

SPA 只通过 React Router 支持站内点击`<Link>`/`<NavLink>`链接的无刷新跳转，  
而**如果是直接地址栏输入 URL**，如`www.example.com` -> `www.example.com/post/1`，则无法进行 SPA，是传统的 HTTP 请求，会向服务器请求`GET /post/1`。

对于 CSR，如果 build 后放到服务器中，如果 nginx 没有配置对应`/post/1`的路由，而只有`/index.html`，则会返回 404。  
需要额外配置一个`index`兜底，如 nginx 的 location，`location / { try_files $url /index.html }`，则找不到的请求都返回`/index.html`。  
此时无论访问什么 URL，都会进入`index.html`，然后加载 JS、Router，根据 URL 匹配再渲染对应 pages。

_注：如果是`npm run dev`，Vite 会自动自行这个兜底。_

## SPA + SSR

### SSR 生成水合前页面

扩展到 SSR，也需要 koa 进行这个工作，则在 SSR 路由（SPA 页面路由）中添加一个全匹配：

```ts
// apps/server/src/ssr.ts
import Router from '@koa/router';
import type Koa from 'koa';
import { fetchDataForUrl } from './fetchDataForUrl';

// 注意：这里 import 的是打包后的 server bundle
import { render } from '../../web/dist/server/entry-server';

const router = new Router();

// 页面 SSR（catch-all）
// 放在静态资源和 /api 路由之后
router.get('(.*)', async (ctx: Koa.Context) => {
  const url = ctx.path; // 简化：不含 query 参数，如需可 ctx.url

  // 1. 根据 URL 预取 SSR 首屏数据
  const initialData = await fetchDataForUrl(url);

  // 2. 调用 React SSR 渲染
  const appHtml = render(url, initialData);

  // 3. 拼出完整 HTML
  ctx.type = 'text/html';
  ctx.body = htmlTemplate(appHtml, initialData);
});

export default router;
```

这样操作，使用`koa-router`，只能让应用无论从哪进入（`/`, `/about`, `/post/1`），都能生成`index`页面（`htmlTemplate()`，其中内容如下）

> ```ts
> // apps/server/src/ssr.ts 里或单独文件
> function htmlTemplate(appHtml: string, initialData: any) {
>   const initialDataJson = JSON.stringify(initialData).replace(
>     /</g,
>     '\\u003c'
>   );
>
>   // 注：下面的 <script src="/assets/entry-client.js"></script> 这句话还不对，还涉及到正确与 entry-client.js 建立连接，这个后面讲。
>   // 这里先这么写，好理解这个模板会加载 entry-client.js，然后其中进行水合，就包括了 React Router 的逻辑，以成为 SPA。
>   // 类比于 CSR 的 index.html 中的 <script type="module" src="/src/main.tsx"></script>
>   return `
> <!DOCTYPE html>
> <html lang="zh-CN">
>   <head>
>     <meta charset="utf-8" />
>     <title>SSR 博客</title>
>   </head>
>   <body>
>     <div id="root">${appHtml}</div>
>     <script>
>       window.__INITIAL_DATA__ = ${initialDataJson};
>     </script>
>     <script src="/assets/entry-client.js"></script>
>   </body>
> </html>
>   `;
> }
> ```

可见其中`import from entry-server`的`render`是 SSR 生成页面的核心渲染函数，其中调用`ReactDOMServer.renderToString`生成 HTML 并返回（此时不考虑 SPA），  
那对于 SPA，需要根据 URL 渲染不同 Page，这个功能还是且应当要 React Router 来做，这个函数一般是怎么写的呢？  
如下：

```ts
// apps/web/src/entry-server.tsx
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { AppShell } from './AppShell';

export function render(url: string, initialData: any) {
  const router = createMemoryRouter(routes, {
    initialEntries: [url],
  });

  const html = ReactDOMServer.renderToString(
    <AppShell router={router} initialData={initialData} />
  );

  return html;
}
```

还是要用到 React Router，只不过因为运行在服务端 Node.js 环境中，不存在 History API，  
所以需要用`createMemoryRouter`，而不是`createBrowserRouter`。

> 拓展 - 四种路由模式：
>
> - `createBrowserRouter`：基于 History API 的路由，常用于 CSR
> - `createHashRouter`：基于 Hash 的路由，常用于不支持 History API 的旧版浏览器
> - `createMemoryRouter`：内存路由，不与 History API 交互，常用于 SSR  
>   其中`initialEntries`用于指定渲染 routes 中哪个 URL（由`initialIndex`指定是数组中的哪一个），这个数组用来模拟 History API。
> - `createStaticRouter`：静态路由，常用于服务端渲染，一般搭配`loader`这个路由中的方法（数据预取）

这样就能生成水合前的页面 HTML。但没有水合，只是生成了对应 URL 的 HTML 页面，此时还没有相应 SPA 功能的实现。

最终生成的 HTML 差不多是：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>SSR 博客</title>
  </head>
  <body>
    <div id="root">
      <div class="flex container">
        <header>
          <h1>SSR 博客</h1>
          <nav>
            <ul>
              <li><a href="/">首页</a></li>
              <li><a href="/about">关于</a></li>
              <li><a href="/posts">文章</a></li>
            </ul>
          </nav>
        </header>
        <main>
          <h2>首页</h2>
          <p>欢迎来到 SSR 博客！</p>
        </main>
      </div>
    </div>
    <script>
      window.__INITIAL_DATA__ = { ... };
    </script>
    <script src="/assets/entry-client.js"></script>
  </body>
</html>
```

### client bundle 执行水合

收到 HTML 后，根据`<script>`标签下载`entry-client.js`，然后执行水合。

```ts
// apps/web/src/entry-client.tsx
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { AppShell } from './AppShell';

// 通过 createBrowserRouter 创建路由，从而在前端层面实现 SPA（点击<Link>后非刷新跳转）
const router = createBrowserRouter(routes);

// __INITIAL_DATA__ 是服务端在 HTML 中注入的全局变量
declare global {
  interface Window {
    __INITIAL_DATA__?: any;
  }
}

// 通过水合挂上 SPA（Router） 逻辑
hydrateRoot(
  document.getElementById('root')!,
  <AppShell router={router} initialData={window.__INITIAL_DATA__} />
);
```

> 说明 - AppShell：
>
> 两个入口`entry-server`和`entry-client`，都用到`<AppShell>`，其就相当于 CSR 的`<App>`，代码如下：
>
> ```ts
> // apps/web/src/AppShell.tsx
> import React from 'react';
> import type { Router } from 'react-router-dom';
> import { RouterProvider } from 'react-router-dom';
>
> interface AppShellProps {
>   router: Router;
>   initialData?: any;
> }
>
> // 可选：用 Context 把 initialData 向下传
> // 后续用 const initialData = React.useContext(InitialDataContext) as { articles?: any[] } | null; 获取
> export const InitialDataContext = React.createContext<any | null>(null);
>
> export function AppShell({ router, initialData }: AppShellProps) {
>   return (
>     <React.StrictMode>
>       <InitialDataContext.Provider value={initialData ?? null}>
>         <RouterProvider router={router} />
>       </InitialDataContext.Provider>
>     </React.StrictMode>
>   );
> }
> ```

### SSR 下 script 的正确链接

前面提到，后端`ssr.ts`生成的 HTML 中，`<script src="/assets/entry-client.js"></script>`还无法与前端`entry-client.tsx`正确链接。

> 拓展 - 对于 CSR 中的链接。
>
> CSR 里（Vite 下），`index.html`有`<script type="module" src="/src/main.tsx"></script>`，  
> 当 build 时，vite 会处理：将`/src/main.tsx`编译成`/assets/main.[hash].js` bundle，  
> 然后生成`index.html`，其中的`/src/main.tsx`替换为`/assets/main.[hash].js`，从而正确链接。

而在 SSR 下，要通过后端 Koa 自行正确链接，有两个步骤：

1. 解决静态文件 js 的位置  
   通过静态资源中间件`koa-static`，指定 web 的构建产物目录`../../web/dist/client`，  
   从而在以后`<script>`指定`src=/assets/entry-client.js`时，能找到`web/dist/client/assets/`这个目录。
2. 解决文件 build 后 hash 后缀  
   有两种方法：
   1. build 固定文件名，不生成 hash：在 vite.config.ts 中配置`build.rollupOptions.output.entryFileNames`  
      ![解决方法 1](<images/image-对 SPA + SSR 的理解.png>)，
   2. （工程版）用 manifest.json 动态查  
      `vite.config.ts`中开启`manifest: true`，然后 build 后会生成`manifest.json`，其中包含 tsx 文件转换后的 js 带 hash 文件名，  
      然后在管静态资源的`assest.ts`，解析`manifest.json`，从而动态生成`entry-client.js`的链接。  
      ![解决方法 2](<images/image-对 SPA + SSR 的理解-1.png>)
