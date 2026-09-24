import { config } from "../config/env.js";
import type { FastifyServerOptions } from "fastify";

export function getLoggerConfig(): FastifyServerOptions["logger"] {
  return {
    level: config.LOG_LEVEL
  };
}
