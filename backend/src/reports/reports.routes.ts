import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import {
  ReportsQuerySchema,
  GenerateReportInputSchema,
  ToggleScheduledReportSchema
} from "./reports.schemas.js";
import {
  getReportsOverview,
  createGeneratedReport,
  toggleScheduledReport,
  exportReportData
} from "./reports.service.js";

export const reportsRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // 1. Overview data with all filtered KPIs, chart series, donut breakdown, quick reports, and generated reports table
  app.get("/overview", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = ReportsQuerySchema.safeParse(request.query);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: {
          message: "Invalid query parameters for reports overview",
          details: parseResult.error.flatten()
        }
      });
    }

    try {
      const data = await getReportsOverview(parseResult.data);
      return reply.status(200).send({
        success: true,
        data
      });
    } catch (err: unknown) {
      app.log.error(err, "Failed to get reports overview");
      return reply.status(500).send({
        success: false,
        error: {
          message: "Failed to aggregate reports data",
          code: "REPORTS_AGGREGATION_FAILED"
        }
      });
    }
  });

  // 2. Generate a new report on-demand
  app.post("/generate", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = GenerateReportInputSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: {
          message: "Invalid report generation parameters",
          details: parseResult.error.flatten()
        }
      });
    }

    try {
      const report = await createGeneratedReport(parseResult.data);
      return reply.status(201).send({
        success: true,
        data: report,
        message: "Report generated successfully"
      });
    } catch (err: unknown) {
      app.log.error(err, "Failed to generate report");
      return reply.status(500).send({
        success: false,
        error: {
          message: "Failed to generate report",
          code: "REPORT_GENERATION_FAILED"
        }
      });
    }
  });

  // 3. Toggle scheduled report
  app.patch("/scheduled/:id/toggle", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    const parseResult = ToggleScheduledReportSchema.safeParse(request.body || {});

    try {
      const updated = await toggleScheduledReport(id, parseResult.success ? parseResult.data : {});
      if (!updated) {
        return reply.status(404).send({
          success: false,
          error: {
            message: "Scheduled report not found",
            code: "SCHEDULED_REPORT_NOT_FOUND"
          }
        });
      }

      return reply.status(200).send({
        success: true,
        data: updated
      });
    } catch (err: unknown) {
      app.log.error(err, "Failed to toggle scheduled report");
      return reply.status(500).send({
        success: false,
        error: {
          message: "Failed to update scheduled report",
          code: "SCHEDULED_REPORT_UPDATE_FAILED"
        }
      });
    }
  });

  // 4. Export / Download report data as CSV or JSON
  app.get("/export", async (request: FastifyRequest<{ Querystring: { reportId?: string; format?: "CSV" | "JSON" } }>, reply: FastifyReply) => {
    const { reportId, format = "CSV" } = request.query;

    try {
      const data = await exportReportData(reportId, format);
      if (format === "JSON") {
        reply.header("Content-Type", "application/json");
        reply.header("Content-Disposition", `attachment; filename="walmart_erp_reports_${Date.now()}.json"`);
      } else {
        reply.header("Content-Type", "text/csv; charset=utf-8");
        reply.header("Content-Disposition", `attachment; filename="walmart_erp_reports_${Date.now()}.csv"`);
      }
      return reply.status(200).send(data);
    } catch (err: unknown) {
      app.log.error(err, "Failed to export report data");
      return reply.status(500).send({
        success: false,
        error: {
          message: "Failed to export report data",
          code: "EXPORT_FAILED"
        }
      });
    }
  });
};
