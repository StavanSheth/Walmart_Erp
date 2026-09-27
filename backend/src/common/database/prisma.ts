import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  datasources: process.env.DATABASE_URL
    ? { db: { url: process.env.DATABASE_URL } }
    : undefined
});

/**
 * Executes a real database ping to verify PostgreSQL connectivity.
 * Returns true if the query succeeds, false otherwise.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Lightweight raw ping query to verify database is reachable and accepting queries
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

/**
 * Disconnects Prisma client cleanly during application shutdown.
 */
export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error("Error disconnecting Prisma client:", err);
  }
}
