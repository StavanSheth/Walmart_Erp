import dotenv from "dotenv";
import { buildApp } from "./app.js";

dotenv.config();

const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || "0.0.0.0";

const app = buildApp();

async function start() {
  try {
    await app.listen({ port, host });
    app.log.info(`Walmart ERP Backend running on http://${host}:${port}`);
    app.log.info(`Health check available at http://${host}:${port}/api/health`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Graceful shutdown
const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
for (const signal of signals) {
  process.on(signal, async () => {
    app.log.info(`Received ${signal}. Shutting down gracefully...`);
    try {
      await app.close();
      process.exit(0);
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
}

start();
