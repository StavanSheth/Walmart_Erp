import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import {
  getSettingsOverview,
  updateCompanySettings,
  updateRegionalSettings,
  updateAppearancePreferences,
  getSettingsAuditLogs
} from "./settings.service.js";
import type {
  UpdateCompanyInput,
  UpdateRegionalInput,
  UpdateAppearanceInput
} from "./settings.types.js";

export const settingsRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // Legacy backward-compatibility endpoint
  app.get("/organization", async (_request: FastifyRequest, reply: FastifyReply) => {
    const overview = await getSettingsOverview();
    return reply.status(200).send({
      success: true,
      data: {
        organization: {
          name: overview.company.name,
          code: overview.company.code,
          currency: overview.regional.currency,
          timezone: overview.regional.timezone,
          status: "ACTIVE"
        },
        storeCount: 7,
        productCount: 450,
        userCount: 248
      }
    });
  });

  // Settings Overview: returns all 6 cards, 4 KPIs, system info, and current user
  app.get("/overview", async (request: FastifyRequest<{ Querystring: { role?: string } }>, reply: FastifyReply) => {
    const simulatedRole = request.query.role;
    const overview = await getSettingsOverview(undefined, simulatedRole);
    return reply.status(200).send({
      success: true,
      data: overview
    });
  });

  // Mutation: Update Company Information (Requires UPDATE_ORGANIZATION_SETTINGS)
  app.patch("/company", async (
    request: FastifyRequest<{ Body: UpdateCompanyInput; Querystring: { role?: string } }>,
    reply: FastifyReply
  ) => {
    const simulatedRole = request.query.role;
    const updated = await updateCompanySettings(undefined, request.body, simulatedRole);
    return reply.status(200).send({
      success: true,
      message: "Company details updated successfully.",
      data: updated
    });
  });

  // Mutation: Update Regional Settings (Requires UPDATE_SYSTEM_SETTINGS)
  app.patch("/regional", async (
    request: FastifyRequest<{ Body: UpdateRegionalInput; Querystring: { role?: string } }>,
    reply: FastifyReply
  ) => {
    const simulatedRole = request.query.role;
    const updated = await updateRegionalSettings(undefined, request.body, simulatedRole);
    return reply.status(200).send({
      success: true,
      message: "Regional settings updated successfully.",
      data: updated
    });
  });

  // Mutation: Update Appearance Preferences (Personal preferences, allowed for all users)
  app.patch("/appearance", async (
    request: FastifyRequest<{ Body: UpdateAppearanceInput }>,
    reply: FastifyReply
  ) => {
    const updated = await updateAppearancePreferences(undefined, request.body);
    return reply.status(200).send({
      success: true,
      message: "Appearance preferences updated successfully.",
      data: updated
    });
  });

  // Audit Logs endpoint to verify audit requirements
  app.get("/audit-logs", async (_request: FastifyRequest, reply: FastifyReply) => {
    const logs = await getSettingsAuditLogs();
    return reply.status(200).send({
      success: true,
      data: logs
    });
  });
};
