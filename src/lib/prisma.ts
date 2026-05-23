import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function getDbUrl(): string {
  if (process.env.NODE_ENV !== 'production') {
    return process.env.DATABASE_URL ?? 'file:./prisma/dev.db';
  }
  // On Vercel the app root is /var/task; copy the db to /tmp so SQLite can write
  const src = path.join(process.cwd(), 'prisma', 'dev.db');
  const tmp = '/tmp/dev.db';
  if (!fs.existsSync(tmp)) {
    try { fs.copyFileSync(src, tmp); } catch { /* no-op if read-only */ }
  }
  return `file:${tmp}`;
}

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    datasources: { db: { url: getDbUrl() } },
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
