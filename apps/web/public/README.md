# 静态资源目录

此目录用于存放**应用级静态资源（App-level Static Assets）**。

## 静态资源分类

本项目中的静态资源分为三类，存放位置和处理方式各不相同：

### 1. 应用级静态资源（App-level）📁 **存放在此目录 `apps/web/public/`**

**特点：**

- 跟前端代码版本强相关（每次发版都跟着走）
- 路径通常是固定的，如 `/favicon.svg`
- 不通过 JS `import`，而是直接在 HTML / `<head>` 里引用
- 不需要经过打包处理，原样复制到构建输出

**示例文件：**

- `favicon.svg` / `favicon.ico` - 网站图标
- `robots.txt` - 搜索引擎爬虫规则
- `manifest.webmanifest` - PWA 配置文件
- `og-default.png` - Open Graph 默认图片

**访问方式：**

```html
<!-- 在 HTML 中直接引用 -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

### 2. 打包内静态资源（Bundle Assets）📁 **存放在 `apps/web/src/assets/`**

**特点：**

- 只在组件代码里用到
- 希望跟着打包一起 hash、做缓存控制
- 通过 `import` / `new URL(..., import.meta.url)` 引用
- Vite 会对其进行优化处理（压缩、hash 等）

**示例文件：**

- `avatar.jpg` - 组件中使用的头像
- `logo.png` - 页面 Logo
- `background.jpg` - 背景图片
- UI 相关的图片资源

**访问方式：**

```tsx
// 在组件中 import
import avatarImg from '@/assets/avatar.jpg';

function Component() {
  return <img src={avatarImg} alt="Avatar" />;
}
```

### 3. 运行时上传资源（User-generated / Runtime Assets）📁 **存放在 `apps/server/uploads/`（或对象存储）**

**特点：**

- 不随前端重新构建产生
- 运行时由后端接收上传、存磁盘或对象存储
- 需要后端通过静态服务器或 CDN 暴露 URL
- 与代码版本无关，独立管理

**示例文件：**

- 博客文章封面图
- 用户上传的头像
- 富文本/Markdown 中插入的图片

**访问方式：**

```tsx
// 从 API 获取 URL
const post = await fetchPost();
<img src={post.coverImageUrl} alt={post.title} />;
```

## 开发环境 vs 生产环境

### 开发环境

- **应用级静态资源**：Vite 开发服务器自动提供（`http://localhost:5173/favicon.svg`）
- **打包内静态资源**：Vite 处理 import 并提供服务
- **运行时资源**：后端 API 提供（`http://localhost:3000/uploads/xxx.jpg`）

### 生产环境（SSR）

- **应用级静态资源**：Server 通过 `koa-static` 中间件提供（`http://example.com/favicon.svg`）
- **打包内静态资源**：打包后的文件通过 CDN 或静态服务器提供
- **运行时资源**：通过对象存储（如 OSS）或 CDN 提供

## 注意事项

1. ⚠️ **不要混淆存放位置**：组件中使用的图片应该放在 `src/assets/`，而不是 `public/`
2. 📦 **打包优化**：`src/assets/` 中的资源会被 Vite 优化（压缩、hash），而 `public/` 中的不会
3. 🔒 **缓存控制**：`src/assets/` 中的资源文件名会带 hash，可以设置长期缓存
4. 🌐 **CDN 部署**：生产环境建议将运行时上传资源放到对象存储/CDN，而不是服务器本地磁盘

### ⚡ SSR 特殊限制

在 SSR 项目中，有一个重要的限制：**Node.js 环境无法直接 import 图片文件**。

这意味着，如果一个组件在服务端渲染时会被执行（如 Layout 组件），那么它不能使用：

```tsx
// ❌ 这在 SSR 中会报错：ERR_UNKNOWN_FILE_EXTENSION
import avatarImg from '@/assets/avatar.jpg';
```

**解决方案：**

对于需要在 SSR 中渲染的组件使用的固定资源（如网站 Logo、默认头像等），有两种选择：

1. **放在 `public/assets/` 目录**（推荐用于固定资源）

   ```tsx
   // ✅ 使用固定路径
   <img src="/assets/avatar.jpg" alt="Avatar" />
   ```

2. **使用条件加载**（适合需要打包优化的场景）

   ```tsx
   // ✅ 仅在客户端 import
   const [avatarSrc, setAvatarSrc] = useState('/assets/avatar.jpg');

   useEffect(() => {
     import('@/assets/avatar.jpg').then((m) => setAvatarSrc(m.default));
   }, []);
   ```

**当前项目中的实践：**

- `public/assets/avatar.jpg` - 网站固定头像（在 SiteSidebar 中使用）
- 虽然放在 public 无法享受打包优化，但这是 SSR 的必要权衡
