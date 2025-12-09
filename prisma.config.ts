// prisma.config.ts
import { defineConfig } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  // 指向你的 schema.prisma 路径
  schema: 'prisma/schema.prisma',

  // 这里配置 datasource 的 url（原来在 schema 里的那行）
  datasource: {
    // 习惯上还是用 env，比写死路径灵活
    url: 'file:dev.db',
  },
});
