# SSR 模式说明：开发 vs 生产

本文档解释了 SSR Blog 项目中开发模式和生产模式的区别，以及如何正确处理资源注入。

## 🔄 两种模式对比

### 开发模式 (`pnpm dev`)

**特点：**

- 使用 Vite Dev Server
- 实时热更新 (HMR)
- 源码直接运行，无需构建
- 使用 `vite.transformIndexHtml()` 自动注入资源

**工作流程：**

1. **SSR 渲染**

   ```typescript
   // 使用 Vite 的 SSR 模块加载器
   const render = await ctx.state.vite.ssrLoadModule('/src/entry-client.tsx');
   const result = await render(request);
   ```

2. **生成基础 HTML**

   ```typescript
   // 不包含任何客户端脚本，只有 SSR 渲染的内容
   html = htmlTemplate(result.html, result.context, [], []);
   ```

3. **Vite 转换 HTML**
   ```typescript
   // 🔑 关键步骤：Vite 自动注入所有需要的资源
   html = await ctx.state.vite.transformIndexHtml(ctx.url, html);
   ```

**`vite.transformIndexHtml()` 会自动注入：**

- ✅ 客户端入口脚本：`<script type="module" src="/src/entry-client.tsx"></script>`
- ✅ HMR 客户端：用于热更新
- ✅ Vite 预加载辅助脚本
- ✅ 开发环境的 CSS 导入（通过 JS 动态注入）

**最终 HTML 示例：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>SSR Blog</title>
    <!-- Vite 自动注入的预加载脚本 -->
    <script type="module" src="/@vite/client"></script>
  </head>
  <body>
    <div id="root"><!-- SSR 内容 --></div>
    <script>
      window.__INITIAL_DATA__ = {...};
    </script>
    <!-- Vite 自动注入的客户端入口 -->
    <script type="module" src="/src/entry-client.tsx"></script>
  </body>
</html>
```

---

### 生产模式 (`pnpm start`)

**特点：**

- 使用预构建的静态文件
- 没有 Vite Dev Server
- 文件名带 hash（如 `index-abc123.js`）
- 从 `manifest.json` 读取资源路径

**工作流程：**

1. **SSR 渲染**

   ```typescript
   // 加载构建后的服务端入口
   const render = await import('../../../web/dist/server/entry-server.js');
   const result = await render(request);
   ```

2. **读取 Manifest**

   ```typescript
   // manifest.json 包含所有构建后的文件路径
   manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
   ```

   **manifest.json 示例：**

   ```json
   {
     "src/entry-client.tsx": {
       "file": "assets/index-BnhicDdh.js",
       "css": ["assets/index-3BIa1ykJ.css"],
       "isEntry": true
     }
   }
   ```

3. **提取资源路径**

   ```typescript
   const styles = getStyles(manifest); // ["/assets/index-3BIa1ykJ.css"]
   const scripts = getScripts(manifest); // ["/assets/index-BnhicDdh.js"]
   ```

4. **生成完整 HTML**
   ```typescript
   // 手动注入 CSS 和 JS
   html = htmlTemplate(result.html, result.context, styles, scripts);
   ```

**最终 HTML 示例：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>SSR Blog</title>
    <!-- 从 manifest 读取的 CSS -->
    <link rel="stylesheet" href="/assets/index-3BIa1ykJ.css" />
  </head>
  <body>
    <div id="root"><!-- SSR 内容 --></div>
    <script>
      window.__INITIAL_DATA__ = {...};
    </script>
    <!-- 从 manifest 读取的 JS -->
    <script type="module" crossorigin src="/assets/index-BnhicDdh.js"></script>
  </body>
</html>
```

---

## 📋 关键区别总结

| 特性             | 开发模式                    | 生产模式                           |
| ---------------- | --------------------------- | ---------------------------------- |
| **Vite Server**  | ✅ 运行中                   | ❌ 不存在                          |
| **资源注入方式** | `vite.transformIndexHtml()` | 手动从 manifest 读取               |
| **文件路径**     | 源码路径 (`/src/...`)       | 带 hash 的构建路径 (`/assets/...`) |
| **CSS 处理**     | JS 动态注入                 | `<link>` 标签预加载                |
| **HMR**          | ✅ 支持                     | ❌ 不支持                          |
| **构建产物**     | ❌ 不需要                   | ✅ 必需                            |

---

## 🔍 为什么需要 `vite.transformIndexHtml()`？

在开发模式下，如果不使用 `vite.transformIndexHtml()`：

❌ **问题：**

- 需要手动硬编码开发服务器 URL（如 `http://localhost:5173/src/entry-client.tsx`）
- HMR 不工作
- Vite 的预加载优化不生效
- 开发和生产的 HTML 结构不一致

✅ **使用后的好处：**

- Vite 自动处理所有资源注入
- HMR 正常工作
- 开发体验更好
- 代码更简洁，无需硬编码 URL

---

## 🚀 实现要点

### htmlTemplate.ts

```typescript
export function htmlTemplate(
  appHtml: string,
  initialData: any,
  styles: string[] = [], // 生产模式传入
  scripts: string[] = [] // 生产模式传入
) {
  // 开发模式：styles 和 scripts 都是空数组
  // 生产模式：从 manifest 读取后传入
}
```

### ssr.ts

```typescript
if (ctx.state.vite) {
  // 开发：空数组 + Vite 转换
  html = htmlTemplate(result.html, result.context, [], []);
  html = await ctx.state.vite.transformIndexHtml(ctx.url, html);
} else {
  // 生产：从 manifest 读取 + 直接注入
  const styles = getStyles(manifest);
  const scripts = getScripts(manifest);
  html = htmlTemplate(result.html, result.context, styles, scripts);
}
```

---

## 📝 注意事项

1. **开发模式启动顺序**
   - 必须先启动 Vite Dev Server（端口 5173）
   - 然后启动 Koa Server（端口 3000）
   - Koa 会代理 Vite 的中间件

2. **生产模式部署**
   - 必须先构建：`pnpm build`
   - 确保 `web/dist/client/.vite/manifest.json` 存在
   - 确保 `web/dist/server/entry-server.js` 存在

3. **静态资源路径**
   - 开发：`/src/assets/background.jpg` → Vite 处理
   - 生产：`/assets/background-abc123.jpg` → 从 `dist/client/assets/` 提供

---

## 🔧 故障排查

### 问题：客户端脚本 404

- **开发模式**：检查 Vite Dev Server 是否运行在 5173 端口
- **生产模式**：检查 manifest.json 是否存在，路径是否正确

### 问题：样式丢失

- **开发模式**：检查 `vite.transformIndexHtml()` 是否被调用
- **生产模式**：检查 manifest 中的 CSS 路径，确保文件存在

### 问题：HMR 不工作

- 确保使用了 `vite.transformIndexHtml()`
- 检查 Vite 中间件是否正确挂载到 Koa
