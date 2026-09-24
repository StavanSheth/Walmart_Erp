import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import { config } from "./common/config/env.js";
import { checkDatabaseConnection } from "./common/database/prisma.js";
import { AppError } from "./common/errors/app-error.js";
import { getLoggerConfig } from "./common/logging/logger.js";

export interface HealthResponse {
  success: boolean;
  service: string;
  status: "ok" | "degraded";
  database: "ok" | "error";
  timestamp: string;
}

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: getLoggerConfig()
  });

  // Configurable CORS with explicit allowed origins
  const allowedOrigins = config.CORS_ORIGIN.split(",").map((o) => o.trim());

  app.register(cors, {
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server, native apps)
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS origin not allowed: ${origin}`), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
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
    reply.status(statusCode).send({
      success: false,
      error: {
        message: statusCode === 500 && config.NODE_ENV === "production"
          ? "Internal Server Error"
          : error.message || "An unexpected error occurred",
        statusCode
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

  // Phase 1 Health Endpoint with real PostgreSQL verification
  app.get("/api/health", async (_request: FastifyRequest, reply: FastifyReply) => {
    const isDbConnected = await checkDatabaseConnection();
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
      // HTTP 503 Service Unavailable when core dependency (database) is down
      return reply.status(503).send(response);
    }
  });

  return app;
}
