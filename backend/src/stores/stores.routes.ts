import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { prisma } from "../common/database/prisma.js";

export const storesRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/", async (_request, reply) => {
    const stores = await prisma.store.findMany({
      include: {
        region: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });

    return reply.status(200).send({
      success: true,
      data: stores
    });
  });
};
