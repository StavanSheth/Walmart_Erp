import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../common/database/prisma.js";
import {
  getPartnersOverview,
  getPartnerById,
  createPartner,
  exportPartnersCsv
} from "./partners.service.js";
import {
  partnersOverviewQuerySchema,
  createPartnerBodySchema,
  partnersExportQuerySchema
} from "./partners.schemas.js";

export const partnersRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // Primary Phase 7 vertical slice endpoint: GET /api/partners/overview
  app.get("/overview", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = partnersOverviewQuerySchema.safeParse(request.query);
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

    const data = await getPartnersOverview(parseResult.data);
    return reply.status(200).send({
      success: true,
      data
    });
  });

  // CSV Export endpoint: GET /api/partners/export (Must be registered before /:id)
  app.get("/export", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = partnersExportQuerySchema.safeParse(request.query);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: {
          message: "Invalid export query parameters",
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: parseResult.error.format()
        }
      });
    }

    const csvContent = await exportPartnersCsv(parseResult.data);
    return reply
      .header("Content-Type", "text/csv; charset=utf-8")
      .header(
        "Content-Disposition",
        `attachment; filename="walmart_partners_export_${new Date().toISOString().slice(0, 10)}.csv"`
      )
      .status(200)
      .send(csvContent);
  });

  // Create Partner endpoint: POST /api/partners
  app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = createPartnerBodySchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: {
          message: "Invalid partner creation payload",
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: parseResult.error.format()
        }
      });
    }

    const partner = await createPartner(parseResult.data);
    return reply.status(201).send({
      success: true,
      data: partner
    });
  });

  // Partner or Customer Detail endpoint: GET /api/partners/:id
  app.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as Record<string, string | undefined>;
    const id = params.id;
    if (!id || id.trim().length === 0) {
      return reply.status(400).send({
        success: false,
        error: {
          message: "Partner or Customer ID is required",
          statusCode: 400,
          code: "VALIDATION_ERROR"
        }
      });
    }

    const data = await getPartnerById(id);
    return reply.status(200).send({
      success: true,
      data
    });
  });

  // Backward compatibility endpoint: GET /api/partners
  app.get("/", async (_request: FastifyRequest, reply: FastifyReply) => {
    const [partners, customers] = await Promise.all([
      prisma.partner.findMany({
        orderBy: { name: "asc" }
      }),
      prisma.customer.findMany({
        orderBy: { name: "asc" }
      })
    ]);

    return reply.status(200).send({
      success: true,
      data: {
        partners,
        customers
      }
    });
  });
};
