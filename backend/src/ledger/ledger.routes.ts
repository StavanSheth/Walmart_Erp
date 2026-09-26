import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import {
  getLedgerOverview,
  getLedgerTransactions,
  getLedgerAccounts,
  createJournalEntry,
  uploadTransactions,
  reconcileAccount,
  generateLedgerReport
} from "./ledger.service.js";
import {
  ledgerTransactionsQuerySchema,
  createJournalEntrySchema,
  uploadTransactionsSchema,
  reconcileAccountSchema
} from "./ledger.schemas.js";

export const ledgerRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // 1. Overview: KPIs, trends, recent transactions, account summaries
  app.get("/overview", async (_request: FastifyRequest, reply: FastifyReply) => {
    const data = await getLedgerOverview();
    return reply.status(200).send({
      success: true,
      data
    });
  });

  // 2. Transactions list with search, account, type, and pagination filters
  app.get("/transactions", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = ledgerTransactionsQuerySchema.safeParse(request.query);
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

    const data = await getLedgerTransactions(parseResult.data);
    return reply.status(200).send({
      success: true,
      data
    });
  });

  // 3. Chart of Accounts
  app.get("/accounts", async (_request: FastifyRequest, reply: FastifyReply) => {
    const accounts = await getLedgerAccounts();
    return reply.status(200).send({
      success: true,
      data: accounts
    });
  });

  // 4. Create New Double-Entry Journal Entry
  app.post("/journal-entries", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = createJournalEntrySchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: {
          message: parseResult.error.errors[0]?.message || "Validation failed for journal entry",
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: parseResult.error.format()
        }
      });
    }

    const created = await createJournalEntry(parseResult.data);
    return reply.status(201).send({
      success: true,
      data: created
    });
  });

  // 5. Upload Transactions (CSV or JSON batch)
  app.post("/upload", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = uploadTransactionsSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: {
          message: "Invalid transaction batch format",
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: parseResult.error.format()
        }
      });
    }

    const result = await uploadTransactions(parseResult.data.entries);
    return reply.status(200).send(result);
  });

  // 6. Reconcile Account
  app.post("/reconcile", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = reconcileAccountSchema.safeParse(request.body || {});
    const input = parseResult.success ? parseResult.data : {};
    const result = await reconcileAccount(input);
    return reply.status(200).send({
      success: true,
      data: result
    });
  });

  // 7. Generate Report
  app.get("/report", async (request: FastifyRequest<{ Querystring: { format?: "json" | "csv" } }>, reply: FastifyReply) => {
    const format = request.query.format === "csv" ? "csv" : "json";
    const report = await generateLedgerReport(format);

    if (report.type === "csv") {
      return reply
        .header("Content-Type", "text/csv; charset=utf-8")
        .header(
          "Content-Disposition",
          `attachment; filename="walmart_general_ledger_${new Date().toISOString().slice(0, 10)}.csv"`
        )
        .status(200)
        .send(report.content);
    }

    return reply.status(200).send({
      success: true,
      data: report
    });
  });
};
