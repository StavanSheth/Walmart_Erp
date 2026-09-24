import { buildApp } from "./app.js";
import { config } from "./common/config/env.js";
import { disconnectPrisma } from "./common/database/prisma.js";

const app = buildApp();

async function start() {
  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    app.log.info(`Walmart ERP Backend listening at http://${config.HOST}:${config.PORT}`);
    app.log.info(`Health check available at http://${config.HOST}:${config.PORT}/api/health`);
  } catch (err) {
    app.log.error(err);
    await disconnectPrisma();
    process.exit(1);
  }
}

// Graceful shutdown handling
let isShuttingDown = false;

async function gracefulShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  app.log.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    // 1. Stop accepting new requests and close Fastify server
    await app.close();
    app.log.info("Fastify server closed.");

    // 2. Disconnect Prisma client
    await disconnectPrisma();
    app.log.info("Prisma client disconnected.");

    app.log.info("Graceful shutdown completed successfully.");
    process.exit(0);
  } catch (err) {
    app.log.error(err, "Error during graceful shutdown");
    process.exit(1);
  }
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

start();
