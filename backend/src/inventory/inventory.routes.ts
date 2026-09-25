import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { getInventoryList, getInventoryById } from "./inventory.service.js";
import { inventoryQuerySchema } from "./inventory.schemas.js";

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

  // Inventory Detail endpoint: GET /api/inventory/:id
  app.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as Record<string, string | undefined>;
    const inventoryId = params.id || params.inventoryId;
    if (!inventoryId || inventoryId.trim().length === 0) {
      return reply.status(400).send({
        success: false,
        error: {
          message: "Invalid inventory ID parameter",
          statusCode: 400,
          code: "VALIDATION_ERROR"
        }
      });
    }

    const query = (request.query || {}) as Record<string, string | undefined>;
    const storeId = query.storeId;

    const data = await getInventoryById(inventoryId, storeId);
    return reply.status(200).send({
      success: true,
      data
    });
  });
}
