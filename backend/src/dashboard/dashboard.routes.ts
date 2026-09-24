import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { getDashboardOverview } from "./dashboard.service.js";
import { dashboardQuerySchema } from "./dashboard.schemas.js";

export async function dashboardRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  app.get("/overview", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = dashboardQuerySchema.safeParse(request.query);
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

    const data = await getDashboardOverview(parseResult.data);
    return reply.status(200).send({
      success: true,
      data
    });
  });
}
