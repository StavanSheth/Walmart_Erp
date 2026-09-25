import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { getInventoryList, getInventoryById } from "./inventory.service.js";
import { inventoryQuerySchema, inventoryIdParamSchema } from "./inventory.schemas.js";

export async function inventoryRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  // Primary endpoint: GET /api/inventory
  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = inventoryQuerySchema.safeParse(request.query);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: {
          message: "Invalid query parameters",
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: parseResult.error.format()
        }
      });
    }

    const data = await getInventoryList(parseResult.data);
    return reply.status(200).send({
      success: true,
      data
    });
  });

  // Inventory Summary endpoint: GET /api/inventory/summary
  app.get("/summary", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = inventoryQuerySchema.safeParse(request.query);
    const params = parseResult.success ? parseResult.data : {};
    const data = await getInventoryList(params);
    return reply.status(200).send({
      success: true,
      data: data.summary
    });
  });

  // Inventory Analytics endpoint: GET /api/inventory/analytics
  app.get("/analytics", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = inventoryQuerySchema.safeParse(request.query);
    const params = parseResult.success ? parseResult.data : {};
    const data = await getInventoryList(params);
    return reply.status(200).send({
      success: true,
      data: data.analytics
    });
  });

  // Inventory Detail endpoint: GET /api/inventory/:id
  app.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = inventoryIdParamSchema.safeParse(request.params);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: {
          message: "Invalid inventory ID parameter",
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: parseResult.error.format()
        }
      });
    }

    const data = await getInventoryById(parseResult.data.id);
    return reply.status(200).send({
      success: true,
      data
    });
  });
}
