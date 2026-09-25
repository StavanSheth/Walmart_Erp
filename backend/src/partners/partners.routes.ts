import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { prisma } from "../common/database/prisma.js";

export const partnersRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/", async (_request, reply) => {
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
