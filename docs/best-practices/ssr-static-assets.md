# SSR 项目中的静态资源处理

## 问题背景

在 SSR 项目中,静态资源(图片、字体等)的处理与纯客户端 SPA 项目不同。

### 错误示例

```tsx
// ❌ 在 SSR 项目中会报错
import avatarImg from '@/assets/avatar.jpg';

<img src={avatarImg} alt="Avatar" />;
```

**错误信息**:

```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".jpg"
```

### 原因分析

1. **客户端 (Vite)**:
   - Vite 可以处理 `import` 图片
   - 会自动转换为优化后的 URL

2. **服务端 (Node.js/tsx)**:
   - Node.js 无法识别 `.jpg`、`.png` 等扩展名
   - tsx 也无法处理这些静态资源
   - 导致 SSR 渲染时报错

## ✅ 解决方案

### 方案一:使用 `public` 目录(推荐)

将静态资源放到 `apps/web/public/` 目录,使用绝对路径引用。

#### 1. 文件位置

```
apps/web/
  ├── public/
  │   ├── avatar.jpg      ✅ 放这里
  │   ├── favicon.svg
  │   └── robots.txt
  └── src/
      └── assets/         ❌ 不要放这里(SSR 无法处理)
```

#### 2. 使用方式

```tsx
// ✅ 正确:使用公共路径
<img src="/avatar.jpg" alt="Avatar" />
```

#### 3. 工作原理

- **开发环境**: Vite 会从 `public/` 目录提供静态文件
- **生产环境**: 构建时会复制到 `dist/` 根目录
- **SSR**: Koa 的静态资源中间件会提供这些文件

#### 4. 优势

- ✅ SSR 和 CSR 都能正常工作
- ✅ 无需额外配置
- ✅ 路径简单明了
- ✅ 符合 Vite 官方推荐

#### 5. 适用场景

- 头像、Logo 等固定资源
- Favicon、robots.txt 等公共文件
- 不需要 hash 的静态资源

---

### 方案二:配置 Vite 插件处理(复杂场景)

如果需要在 `src/assets` 中使用 import,需要配置特殊的 Vite 插件。

#### 1. 安装插件

```bash
pnpm add -D vite-plugin-static-copy
```

#### 2. 配置 `vite.config.ts`

```typescript
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/**/*',
          dest: 'assets',
        },
      ],
    }),
  ],
});
```

#### 3. 创建类型声明

```typescript
// src/vite-env.d.ts
declare module '*.jpg' {
  const src: string;
  export default src;
}
```

#### 4. 使用方式

```tsx
import avatarImg from '@/assets/avatar.jpg';

<img src={avatarImg} alt="Avatar" />;
```

#### 5. 缺点

- ❌ 配置复杂
- ❌ 需要额外插件
- ❌ SSR 环境需要特殊处理

---

## 当前项目配置

### 静态资源中间件

在 `apps/server/src/app.ts` 中已配置:

```typescript
import serve from 'koa-static';
import path from 'path';

// 静态资源中间件 - 提供 web/public 目录下的静态文件
app.use(
  serve(
    path.join(path.dirname(fileURLToPath(import.meta.url)), '../../web/public')
  )
);
```

这个中间件会:

1. 提供 `apps/web/public/` 目录下的所有文件
2. 支持 `/avatar.jpg`、`/favicon.svg` 等路径
3. 自动处理缓存和 MIME 类型

### 目录结构

```
apps/web/public/
  ├── avatar.jpg        # 头像
  ├── favicon.svg       # 网站图标
  └── robots.txt        # SEO 配置
```

---

## 最佳实践总结

| 资源类型   | 推荐位置          | 引用方式       | 原因     |
| ---------- | ----------------- | -------------- | -------- |
| 头像、Logo | `public/`         | `/avatar.jpg`  | SSR 兼容 |
| Favicon    | `public/`         | `/favicon.svg` | 标准位置 |
| robots.txt | `public/`         | `/robots.txt`  | SEO 需要 |
| 组件内图标 | 使用 Lucide React | `<Icon />`     | 更灵活   |
| 动态图片   | API 返回 URL      | 数据库存储路径 | 可管理   |

---

## 注意事项

### 1. 路径问题

```tsx
// ✅ 正确:以 / 开头的绝对路径
<img src="/avatar.jpg" />

// ❌ 错误:相对路径(可能在不同路由下失效)
<img src="avatar.jpg" />
```

### 2. 缓存策略

- `public/` 目录的文件在生产环境会被缓存
- 如果需要更新,建议添加版本号:`/avatar.jpg?v=2`
- 或使用 hash 命名:`/avatar-abc123.jpg`

### 3. CDN 部署

生产环境可以将 `public/` 目录上传到 CDN:

```tsx
const CDN_URL = import.meta.env.VITE_CDN_URL || '';
<img src={`${CDN_URL}/avatar.jpg`} />;
```

### 4. 图片优化

- 使用 WebP 格式减小体积
- 提供多种尺寸(响应式)
- 添加 `loading="lazy"` 懒加载

---

## 相关文件

- `apps/server/src/app.ts` - 静态资源中间件配置
- `apps/web/public/` - 公共静态资源目录
- `apps/web/src/layouts/SiteSidebar.tsx` - 头像使用示例
