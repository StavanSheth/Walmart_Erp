import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

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
