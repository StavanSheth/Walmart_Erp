import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import { config } from "./common/config/env.js";
import { checkDatabaseConnection } from "./common/database/prisma.js";
import { AppError } from "./common/errors/app-error.js";
import { getLoggerConfig } from "./common/logging/logger.js";
import { dashboardRoutes } from "./dashboard/dashboard.routes.js";
import { inventoryRoutes } from "./inventory/inventory.routes.js";

export interface HealthResponse {
  success: boolean;
  service: string;
  status: "ok" | "degraded";
  database: "ok" | "error";
  timestamp: string;
}

export interface AppOptions {
  checkDb?: () => Promise<boolean>;
}

export function buildApp(options: AppOptions = {}): FastifyInstance {
  const checkDb = options.checkDb ?? checkDatabaseConnection;

  const app = fastify({
    logger: getLoggerConfig()
  });

  // Configurable CORS supporting production origins and local development loopbacks
  const allowedOrigins = config.corsOrigins.map((origin) => origin.replace(/\/$/, ""));
  const isDev = config.NODE_ENV !== "production";

  app.register(cors, {
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server, native tools)
      if (!origin) {
        callback(null, true);
        return;
      }
      const normalized = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(normalized) ||
        (isDev && /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(normalized))
      ) {
        callback(null, true);
      } else {
        // Disallow CORS: do not reflect Access-Control-Allow-Origin
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"]
  });

  // Centralized Error Handling
  app.setErrorHandler((error: Error, _request: FastifyRequest, reply: FastifyReply) => {
    app.log.error(error);

    if (error instanceof AppError) {
      reply.status(error.statusCode).send({
        success: false,
        error: {
          message: error.message,
          statusCode: error.statusCode,
          code: error.code
        }
      });
      return;
    }

    const statusCode = (error as { statusCode?: number }).statusCode || 500;
    const isProd = config.NODE_ENV === "production";
    reply.status(statusCode).send({
      success: false,
      error: {
        message: statusCode === 500 && isProd
          ? "Internal Server Error"
          : error.message || "An unexpected error occurred",
        statusCode,
        code: statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "ERROR"
      }
    });
  });

  // 404 Handler
  app.setNotFoundHandler((_request: FastifyRequest, reply: FastifyReply) => {
    reply.status(404).send({
      success: false,
      error: {
        message: "Endpoint not found",
        statusCode: 404,
        code: "NOT_FOUND"
      }
    });
  });

  // Phase 1 Health Endpoint with PostgreSQL verification
  app.get("/api/health", async (_request: FastifyRequest, reply: FastifyReply) => {
    const isDbConnected = await checkDb();
    const timestamp = new Date().toISOString();

    if (isDbConnected) {
      const response: HealthResponse = {
        success: true,
        service: "walmart-erp-backend",
        status: "ok",
        database: "ok",
        timestamp
      };
      return reply.status(200).send(response);
    } else {
      const response: HealthResponse = {
        success: false,
        service: "walmart-erp-backend",
        status: "degraded",
        database: "error",
        timestamp
      };
      return reply.status(503).send(response);
    }
  });

  // Phase 5 Dashboard Routes
  app.register(dashboardRoutes, { prefix: "/api/dashboard" });

  // Phase 6 Inventory Routes
  app.register(inventoryRoutes, { prefix: "/api/inventory" });

  return app;
}
