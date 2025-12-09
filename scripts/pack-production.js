#!/usr/bin/env node

/**
 * 生产部署打包脚本
 *
 * 功能：将构建产物打包成独立的生产部署包，不包含源码和 monorepo 结构
 *
 * 使用方法：
 *   node scripts/pack-production.js
 *
 * 输出：
 *   production/ 目录，包含所有运行所需的文件
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'production');

console.log('📦 开始打包生产部署包...\n');

// 清理输出目录
if (fs.existsSync(outputDir)) {
  console.log('🧹 清理旧的 production 目录...');
  fs.removeSync(outputDir);
}

fs.ensureDirSync(outputDir);

// 1. 复制服务器构建产物
console.log('📋 复制服务器构建产物...');
fs.copySync(
  path.join(rootDir, 'apps/server/dist'),
  path.join(outputDir, 'server')
);

// 2. 复制 Web 构建产物
console.log('📋 复制 Web 构建产物...');
fs.copySync(
  path.join(rootDir, 'apps/web/dist'),
  path.join(outputDir, 'web/dist')
);

// 3. 复制 Shared 构建产物
console.log('📋 复制 Shared 构建产物...');
fs.copySync(
  path.join(rootDir, 'packages/shared/dist'),
  path.join(outputDir, 'node_modules/ssr-blog-shared/dist')
);

// 4. 创建 shared 的 package.json
console.log('📋 创建 shared package.json...');
const sharedPackageJson = {
  name: 'ssr-blog-shared',
  version: '1.0.0',
  type: 'module',
  main: './dist/index.js',
  types: './dist/index.d.ts',
};
fs.writeJsonSync(
  path.join(outputDir, 'node_modules/ssr-blog-shared/package.json'),
  sharedPackageJson,
  { spaces: 2 }
);

// 5. 复制 Prisma schema
console.log('📋 复制 Prisma schema...');
fs.copySync(path.join(rootDir, 'prisma'), path.join(outputDir, 'prisma'));

// 6. 复制数据库文件（如果存在）
const dbFile = path.join(rootDir, 'dev.db');
if (fs.existsSync(dbFile)) {
  console.log('📋 复制数据库文件...');
  fs.copySync(dbFile, path.join(outputDir, 'prod.db'));
}

// 7. 创建 uploads 目录
console.log('📋 创建 uploads 目录...');
fs.ensureDirSync(path.join(outputDir, 'uploads'));

// 8. 创建生产环境的 package.json
console.log('📋 创建生产环境 package.json...');
const productionPackageJson = {
  name: 'ssr-blog-production',
  version: '1.0.0',
  type: 'module',
  scripts: {
    start: 'node server/app.js',
    'db:generate': 'prisma generate',
  },
  dependencies: {
    '@koa/router': '^14.0.0',
    '@prisma/client': '^7.0.1',
    '@types/react': '^19.2.7',
    bcryptjs: '^3.0.3',
    dotenv: '^17.2.3',
    jsonwebtoken: '^9.0.2',
    koa: '^3.1.1',
    'koa-bodyparser': '^4.4.1',
    'koa-connect': '^2.1.0',
    'koa-jwt': '^4.0.4',
    'koa-logger': '^4.0.0',
    'koa-mount': '^4.2.0',
    'koa-static': '^5.0.0',
    'prisma-adapter-node-sqlite': '^0.0.1',
    react: '^19.2.0',
    winston: '^3.18.3',
  },
  devDependencies: {
    prisma: '^7.0.1',
  },
};

fs.writeJsonSync(path.join(outputDir, 'package.json'), productionPackageJson, {
  spaces: 2,
});

// 9. 创建 .env 模板
console.log('📋 创建 .env 模板...');
const envTemplate = `# 生产环境配置
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# 数据库配置
DATABASE_URL="file:./prod.db"

# JWT 密钥（请修改为强密钥）
JWT_SECRET=change-this-to-a-strong-secret-key-in-production

# 日志级别
LOG_LEVEL=info
`;

fs.writeFileSync(path.join(outputDir, '.env.example'), envTemplate);

// 如果根目录有 .env，也复制一份
if (fs.existsSync(path.join(rootDir, '.env'))) {
  fs.copySync(path.join(rootDir, '.env'), path.join(outputDir, '.env'));
}

// 10. 创建 README.md
console.log('📋 创建部署说明...');
const readmeContent = `# SSR Blog - 生产部署包

这是一个独立的生产部署包，包含所有运行所需的编译后文件。

## 📂 目录结构

\`\`\`
production/
├── server/              # 服务器编译后的代码
├── web/dist/            # Web 构建产物
│   ├── client/          # 客户端静态资源
│   └── server/          # SSR 服务器端代码
├── node_modules/        # 依赖（需要安装）
│   └── ssr-blog-shared/ # 共享类型（已包含）
├── prisma/              # 数据库 schema
├── uploads/             # 上传文件目录
├── package.json         # 生产依赖配置
├── .env.example         # 环境变量模板
└── prod.db              # 数据库文件（如果存在）
\`\`\`

## 🚀 部署步骤

### 1. 上传到服务器

\`\`\`bash
# 使用 scp 上传整个目录
scp -r production/ user@server:/var/www/ssr-blog/

# 或使用 rsync
rsync -av production/ user@server:/var/www/ssr-blog/
\`\`\`

### 2. 安装依赖

\`\`\`bash
cd /var/www/ssr-blog
npm install --production
# 或
pnpm install --prod
\`\`\`

### 3. 生成 Prisma Client

\`\`\`bash
npm run db:generate
\`\`\`

### 4. 配置环境变量

\`\`\`bash
cp .env.example .env
nano .env  # 编辑配置
\`\`\`

确保修改以下配置：
- \`JWT_SECRET\`: 设置强密钥
- \`DATABASE_URL\`: 数据库路径
- \`PORT\`: 服务端口

### 5. 启动服务

**直接启动：**
\`\`\`bash
npm start
\`\`\`

**使用 PM2（推荐）：**
\`\`\`bash
# 安装 PM2
npm install -g pm2

# 启动
pm2 start server/app.js --name ssr-blog -i max

# 查看状态
pm2 status

# 查看日志
pm2 logs ssr-blog

# 设置开机自启
pm2 startup
pm2 save
\`\`\`

## 🔍 验证

访问服务器：
\`\`\`bash
curl http://localhost:3000
\`\`\`

## 📝 注意事项

1. **数据库**：首次部署需要运行数据库迁移或使用提供的数据库文件
2. **上传目录**：确保 \`uploads/\` 目录有写权限
3. **环境变量**：务必修改 \`.env\` 中的敏感信息
4. **端口**：确保配置的端口未被占用

## 🔧 故障排查

### 端口被占用
\`\`\`bash
lsof -i :3000
kill -9 <PID>
\`\`\`

### 数据库错误
\`\`\`bash
# 重新生成 Prisma Client
npm run db:generate
\`\`\`

### 静态资源 404
检查 \`web/dist/client/\` 目录是否存在且有正确的文件

## 📦 更新部署

1. 在开发环境重新构建：\`pnpm build\`
2. 重新运行打包脚本：\`node scripts/pack-production.js\`
3. 上传新的 production 目录
4. 在服务器上重启服务：\`pm2 restart ssr-blog\`
`;

fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent);

// 11. 创建 PM2 配置文件
console.log('📋 创建 PM2 配置文件...');
const pm2Config = `module.exports = {
  apps: [{
    name: 'ssr-blog',
    script: './server/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
`;

fs.writeFileSync(path.join(outputDir, 'ecosystem.config.cjs'), pm2Config);

// 创建日志目录
fs.ensureDirSync(path.join(outputDir, 'logs'));

console.log('\n✅ 生产部署包打包完成！');
console.log(`\n📁 输出目录: ${outputDir}`);
console.log('\n📋 下一步：');
console.log('  1. 将 production/ 目录上传到服务器');
console.log('  2. 在服务器上运行: npm install --production');
console.log('  3. 生成 Prisma Client: npm run db:generate');
console.log('  4. 配置 .env 文件');
console.log('  5. 启动服务: npm start 或 pm2 start ecosystem.config.cjs');
console.log('\n详细说明请查看: production/README.md\n');
