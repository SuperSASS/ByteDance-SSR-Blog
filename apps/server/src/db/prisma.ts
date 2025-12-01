// apps/server/src/db/prisma.ts
import 'dotenv/config';
import { PrismaClient } from './generated/client/client.js';
import { PrismaNodeSQLite } from 'prisma-adapter-node-sqlite';

const url = process.env.DATABASE_URL ?? 'file:../../dev.db';

const adapter = new PrismaNodeSQLite({
  url,
});

export const prisma = new PrismaClient({ adapter });
