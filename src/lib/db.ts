import { PrismaClient } from '@prisma/client';
import path from 'path';

// Ensure DATABASE_URL is always defined in serverless environments
if (!process.env.DATABASE_URL) {
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  process.env.DATABASE_URL = `file:${dbPath}`;
} else if (process.env.DATABASE_URL.startsWith('file:') && !path.isAbsolute(process.env.DATABASE_URL.replace('file:', ''))) {
  const relPath = process.env.DATABASE_URL.replace('file:', '').replace(/^\.\//, '');
  const absPath = path.join(process.cwd(), relPath.startsWith('prisma') ? relPath : path.join('prisma', relPath));
  process.env.DATABASE_URL = `file:${absPath}`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;