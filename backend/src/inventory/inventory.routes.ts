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

  // Inventory Detail endpoint: GET /api/inventory/:inventoryId
  app.get("/:inventoryId", async (request: FastifyRequest, reply: FastifyReply) => {
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

    const data = await getInventoryById(parseResult.data.inventoryId);
    return reply.status(200).send({
      success: true,
      data
    });
  });
}
