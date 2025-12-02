# SSR URL 构建最佳实践

## 问题背景

在 SSR 场景中,需要将 Koa 的 Request 转换为 Web Standard Request。这要求我们构建完整的 URL (包括协议、域名、端口和路径)。

❌ **错误做法**:硬编码 URL

```typescript
const request = new Request(`http://localhost:3000${ctx.url}`, {
  method: ctx.method,
  headers: ctx.headers as any,
});
```

**问题**:

- 无法适应不同环境 (开发/测试/生产)
- 部署到不同域名时需要修改代码
- 不支持 HTTPS
- 端口固定,缺乏灵活性

## ✅ 最佳实践:动态 URL 构建

### 实现方案

```typescript
// 优先使用环境变量 BASE_URL,否则从请求头中获取
const baseUrl = process.env.BASE_URL || `${ctx.protocol}://${ctx.host}`;
const fullUrl = `${baseUrl}${ctx.url}`;

const request = new Request(fullUrl, {
  method: ctx.method,
  headers: ctx.headers as any,
});
```

### 工作原理

1. **环境变量优先**:
   - 如果设置了 `BASE_URL` 环境变量,直接使用
   - 适用于生产环境,明确指定域名

2. **自动检测 (fallback)**:
   - `ctx.protocol`: 自动获取协议 (`http` 或 `https`)
   - `ctx.host`: 自动获取主机名和端口 (如 `localhost:3000` 或 `yourdomain.com`)
   - 适用于开发环境,无需额外配置

### 环境配置示例

#### 开发环境 (.env)

```bash
PORT=3000
# BASE_URL 不设置,自动使用 http://localhost:3000
```

#### 生产环境 (.env.production)

```bash
PORT=3000
BASE_URL=https://blog.example.com
```

#### 测试环境 (.env.test)

```bash
PORT=3001
BASE_URL=http://test.example.com
```

## 其他方案对比

### 方案二:完全依赖请求头

```typescript
const fullUrl = `${ctx.protocol}://${ctx.host}${ctx.url}`;
```

- ✅ 简单,无需配置
- ❌ 在某些反向代理场景下可能不准确
- ❌ 无法覆盖特殊情况

### 方案三:完全使用环境变量

```typescript
const fullUrl = `${process.env.BASE_URL}${ctx.url}`;
```

- ✅ 完全可控
- ❌ 每个环境都必须配置
- ❌ 开发体验较差

## 推荐实践

我们采用的**混合方案**兼顾了灵活性和便利性:

| 环境 | 配置方式        | 原因                    |
| ---- | --------------- | ----------------------- |
| 开发 | 不设置 BASE_URL | 自动检测,方便开发       |
| 测试 | 可选设置        | 根据测试环境决定        |
| 生产 | **必须设置**    | 明确控制,避免依赖请求头 |

## 注意事项

1. **反向代理场景**: 如果使用 Nginx 等反向代理,确保正确转发了 `X-Forwarded-Proto` 和 `X-Forwarded-Host` 头,Koa 会自动处理这些头。

2. **HTTPS 支持**: 生产环境务必使用 HTTPS,在 `BASE_URL` 中明确指定 `https://`。

3. **端口处理**: `ctx.host` 已包含端口信息,无需单独处理。

4. **CDN 场景**: 如果使用 CDN,`BASE_URL` 应设置为 CDN 域名。

## 相关文件

- `apps/server/src/routes/ssr.ts` - SSR 路由实现
- `.env.example` - 环境变量模板
- `apps/server/src/app.ts` - 服务器主文件
