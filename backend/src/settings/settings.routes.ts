import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { prisma } from "../common/database/prisma.js";

export const settingsRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/organization", async (_request, reply) => {
    const [organization, storeCount, productCount, userCount] = await Promise.all([
      prisma.organization.findFirst(),
      prisma.store.count(),
      prisma.product.count(),
      prisma.user.count()
    ]);

    return reply.status(200).send({
      success: true,
      data: {
        organization,
        storeCount,
        productCount,
        userCount
      }
    });
  });
};
