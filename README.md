# ✍️ SSR Blog

一个使用 React 19、React Router 7、Koa 3 和 TypeScript 构建的现代化全栈 SSR 博客平台。本项目采用 Monorepo 架构，旨在作为掌握现代前端架构、服务端渲染（SSR）及全栈开发实践的学习平台。

> **SSR Blog** - 探索 React Router v7 开发范式与 SSR 最佳实践的技术博客系统

## ✨ 功能特性

### 基础功能

- 🚀 **SSR 博客前台** - 博客前台展示，服务端渲染文章列表与详情页，首屏加载快，SEO 友好
- 📚 **后台管理** - 博客后台管理，完整的文章、类别、标签增删改查 (CRUD) 流程
- 🏷️ **分类标签** - 灵活的内容组织结构，支持多标签关联
- 👥 **用户体系** - 基于 JWT 的身份认证，支持登录/登出
- 🛡️ **权限控制** - 基于角色的访问控制 (RBAC)，区分管理员与普通用户
- 📦 **后端 API** - 提供文章、类别、标签的增删改查 (CRUD) API，支持分页、排序、搜索等

### 进阶功能

- 📦 **资源缓存** - 包含静态资源缓存（CSS、JS、图片等，基于强缓存）和动态资源缓存（HTML，基于协商缓存）
- 📊 **阅读统计** - 文章阅读量计数与可视化展示
- 📸 **图片上传** - 文章封面支持本地图片上传
- 🛡️ **接口防刷** - 针对高频接口的限流保护机制
- 📝 **Markdown 编辑** - 集成富文本/Markdown 双模式编辑器，支持实时预览
- ⏱️ **智能估时** - 基于字数自动计算文章阅读时长
- 🏷️ **标签云** - 数据可视化的标签聚合展示
- 🎨 **主题系统** - 深度集成的明暗主题切换，自动适配系统偏好

### 技术特色

- 🏗️ **Monorepo** - 使用 pnpm workspaces 高效管理多包项目
- 🛤️ **Router v7** - 采用 React Router 7 Data API 统一前后端路由
- 📦 **数据库** - 使用 SQLite 数据库和 Prisma ORM，支持文章、类别、标签的增删改查 (CRUD) 操作
- 🎯 **全栈类型** - 前后端完全 TypeScript 覆盖，DTO 类型共享
- 🧩 **组件化** - 基于 shadcn/ui (Radix UI) 构建的高质量 UI 组件库
- 🧩 **工程化** - 完善的 ESLint + Prettier + Husky 规范体系

## 🏗️ 架构

### 项目结构

```
SSR-Blog/
├── apps/
│   ├── web/               # 前端 SSR + SPA 应用
│   │   ├── src/
│   │   │   ├── app/           # 应用全局入口
│   │   │   ├── components/    # 可复用 UI 组件
│   │   │   ├── pages/         # 页面组件
│   │   │   ├── routes/        # 路由定义
│   │   │   ├── services/      # API 请求封装
│   │   │   ├── entry-client.tsx # 客户端入口 (Hydration)
│   │   │   ├── entry-server.tsx # 服务端入口 (SSR Render)
│   │   │   └── index.css      # 全局样式 (Tailwind)
│   └── server/            # 后端 Koa API & SSR 服务
│       ├── src/
│       │   ├── controllers/   # 业务控制器
│       │   ├── db/            # 数据库访问层 (Prisma)
│       │   ├── middleware/    # Koa 中间件 (Auth, Logger)
│       │   ├── routes/        # API 与页面路由挂载
│       │   ├── services/      # 核心业务逻辑
│       │   ├── utils/         # 工具函数
│       │   └── app.ts         # 应用入口与配置
├── packages/
│   └── shared/            # 共享工作区
│       ├── src/
│       │   ├── dtos/          # 数据传输对象 (DTO)
│       │   └── types/         # 全局共享类型
└── docs/                  # 项目文档
```

### 技术栈

#### 前端 (`apps/web`)

- **框架**: React 19
- **路由**: React Router v7
- **构建**: Vite
- **语言**: TypeScript
- **UI**: shadcn/ui (Radix UI)
- **样式**: Tailwind CSS v4
- **编辑器**: @uiw/react-md-editor
- **Markdown**: react-markdown

#### 后端 (`apps/server`)

- **运行时**: Node.js (ESM)
- **框架**: Koa 3
- **ORM**: Prisma
- **数据库**: SQLite
- **中间件**
  - **鉴权**: koa-jwt, jsonwebtoken, bcryptjs
  - **日志**: koa-logger, winston
  - **静态资源**：koa-static
  - **连接转换**：koa-connect

#### 共享包 (`packages/shared`)

- **ssr-blog-shared**: 包含前后端通用的接口定义 (DTO) 与类型工具，确保 API 契约一致性。

#### 开发工具

- **包管理**: pnpm (Workspaces)
- **规范检查**: ESLint, Prettier
- **Git Hooks**: Husky, lint-staged
- **提交规范**: Commitlint

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装

1. 克隆仓库：

```bash
git clone https://github.com/yourusername/SSR-Blog.git
cd SSR-Blog
```

2. 安装依赖：

```bash
pnpm install
```

3. 数据库初始化：

```bash
# 生成 Prisma Types
pnpm db:client

# 运行数据库迁移
pnpm db:migration

# 写入初始数据 (含测试账号)
pnpm db:reset
```

4. 启动开发服务器：

```bash
pnpm dev
```

访问 `http://localhost:3000` 即可预览。

### 测试账号

| 角色       | 用户名   | 密码        | 说明             |
| ---------- | -------- | ----------- | ---------------- |
| **Admin**  | `admin`  | `admin123`  | 拥有所有管理权限 |
| **Editor** | `editor` | `editor123` | 仅限内容编辑     |

## 🌐 API

后端提供 RESTful 风格的 API 接口，以下为部分核心端点示例：

### 文章 (Posts)

- `GET /api/posts` - 获取文章列表 (支持分页 `page`, `pageSize`, 筛选 `tag`, `category`)
- `GET /api/posts/:id` - 获取文章详情
- `POST /api/posts` - 创建新文章 (需鉴权)
- `PUT /api/posts/:id` - 更新文章 (需鉴权)

### 认证 (Auth)

- `POST /api/auth/login` - 用户登录，返回 JWT Token
- `GET /api/auth/me` - 获取当前用户信息 (需携带 Token)

## 🔧 开发

### 代码规范

项目已经配置了严格的代码规范，提交代码前会自动通过 Husky 运行检查：

- **Lint**: ESLint 检查代码质量
- **Format**: Prettier 统一代码风格
- **Commit**: 遵循 Conventional Commits 规范 (feat, fix, docs, etc.)

### 分层架构说明

为保持代码整洁与可维护性，请遵循以下分层原则：

1. **Controller 层**: 仅处理 HTTP 请求/响应，参数解析与验证。
2. **Service 层**: 包含所有业务逻辑，数据库操作应封装在此层。
3. **Shared 层**: 所有 DTO 接口定义应放在 shared 包中，禁止前后端重复定义类型。

## 🎯 路线图

- [ ] **性能优化**: 引入 Redis 缓存文章列表与详情
- [ ] **AI 赋能**: 集成 AI 写作助手与摘要生成
- [ ] **部署**: Docker 容器化部署支持
- [ ] **互动**: 增加文章评论与点赞功能
- [ ] **SEO**: 完善 Meta 标签动态生成与 Sitemap

## 📄 许可证

本项目仅用于教育目的。

## 👤 作者

**SuperSASS**

## 🙏 致谢

- React 和 Koa 社区与 SSR 支持
- shadcn/ui 提供的优秀组件库
- 字节跳动工程训练营项目
- Google Antigravity 与 Genimi 的指导与教学

---

用 ❤️ 构建，作为掌握现代 SSR 开发的学习项目
