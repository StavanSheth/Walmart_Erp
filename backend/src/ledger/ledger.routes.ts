import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { prisma } from "../common/database/prisma.js";

export const ledgerRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/accounts", async (_request, reply) => {
    const accounts = await prisma.account.findMany({
      include: {
        journalLines: true
      },
      orderBy: { code: "asc" }
    });

    return reply.status(200).send({
      success: true,
      data: accounts.map((acc) => {
        const balance = acc.journalLines.reduce((sum, line) => {
          return sum + Number(line.debit) - Number(line.credit);
        }, 0);

        return {
          id: acc.id,
          code: acc.code,
          name: acc.name,
          type: acc.type,
          currency: "USD",
          balance,
          status: acc.isActive ? "ACTIVE" : "INACTIVE"
        };
      })
    });
  });
};
