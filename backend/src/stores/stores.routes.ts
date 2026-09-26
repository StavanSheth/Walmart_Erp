import { FastifyInstance, FastifyPluginAsync } from "fastify";
import {
  getStoresOverview,
  getStoresNetwork,
  listStores,
  getStoreById
} from "./stores.service.js";
import {
  StoresQueryParamsSchema,
  StoresOverviewQueryParamsSchema,
  StoresNetworkQueryParamsSchema,
  StoreDetailParamsSchema
} from "./stores.schemas.js";

export const storesRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // 1. Overview endpoint for the stores dashboard
  app.get("/overview", async (request, reply) => {
    const query = StoresOverviewQueryParamsSchema.parse(request.query);
    const overview = await getStoresOverview(query);

    return reply.status(200).send({
      success: true,
      data: overview
    });
  });

  // 2. Network endpoint for map plotting
  app.get("/network", async (request, reply) => {
    const query = StoresNetworkQueryParamsSchema.parse(request.query);
    const network = await getStoresNetwork(query);

    return reply.status(200).send({
      success: true,
      data: network
    });
  });

  // 3. List stores with pagination, search, region, and status filtering
  app.get("/", async (request, reply) => {
    const query = StoresQueryParamsSchema.parse(request.query);
    const result = await listStores(query);

    return reply.status(200).send({
      success: true,
      data: result.stores,
      meta: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: Math.ceil(result.total / result.pageSize)
      }
    });
  });

  // 4. Detail endpoint for an individual store
  app.get("/:id", async (request, reply) => {
    const params = StoreDetailParamsSchema.parse(request.params);
    const detail = await getStoreById(params.id);

    return reply.status(200).send({
      success: true,
      data: detail
    });
  });
};
