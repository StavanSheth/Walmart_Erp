import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: {
      level: process.env.LOG_LEVEL || "info"
    }
  });

  // Configurable CORS
  const configuredOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
  const allowedOrigins = configuredOrigin.split(",").map((o) => o.trim());

  app.register(cors, {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
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

  // Global error handler
  app.setErrorHandler((error: Error, _request: FastifyRequest, reply: FastifyReply) => {
    app.log.error(error);
    const statusCode = (error as { statusCode?: number }).statusCode || 500;
    reply.status(statusCode).send({
      success: false,
      error: {
        message: error.message || "Internal Server Error",
        statusCode
      }
    });
  });

  // Phase 1 Health Endpoint
  app.get("/api/health", async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      success: true,
      service: "walmart-erp-backend",
      status: "ok"
    });
  });

  return app;
}
