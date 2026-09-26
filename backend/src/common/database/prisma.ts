import { PrismaClient } from "@prisma/client";

import { execSync } from "child_process";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getResolvedDatabaseUrl(): string | undefined {
  let url = process.env.DATABASE_URL;
  if (!url) return undefined;

  // On Windows, if connecting to localhost or 127.0.0.1, resolve WSL2 IP dynamically if available
  if (process.platform === "win32" && (url.includes("@localhost:5432") || url.includes("@127.0.0.1:5432"))) {
    try {
      const wslIp = execSync("wsl -d Ubuntu-22.04 -u root hostname -I", {
        encoding: "utf8",
        timeout: 1000
      }).trim().split(" ")[0];
      if (wslIp && /^\d+\.\d+\.\d+\.\d+$/.test(wslIp)) {
        return url.replace(/@(localhost|127\.0\.0\.1):5432/, `@${wslIp}:5432`);
      }
    } catch {
      // fallback to configured url
    }
  }
  return url;
}

const resolvedUrl = getResolvedDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    resolvedUrl
      ? {
          datasources: {
            db: {
              url: resolvedUrl
            }
          }
        }
      : undefined
  );

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
