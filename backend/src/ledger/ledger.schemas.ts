import { z } from "zod";

export const ledgerTransactionsQuerySchema = z.object({
  q: z.string().optional(),
  account: z.string().optional(),
  type: z.enum(["ALL", "DEBIT", "CREDIT", "Debit", "Credit"]).optional().default("ALL"),
  status: z.enum(["ALL", "POSTED", "PENDING", "Posted", "Pending"]).optional().default("ALL"),
  period: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  offset: z.coerce.number().min(0).optional().default(0)
});

export type LedgerTransactionsQuery = z.infer<typeof ledgerTransactionsQuerySchema>;

export const createJournalLineSchema = z.object({
  accountId: z.string().min(1, "Account ID is required"),
  debit: z.coerce.number().min(0, "Debit cannot be negative"),
  credit: z.coerce.number().min(0, "Credit cannot be negative")
});

export const createJournalEntrySchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters"),
  referenceNumber: z.string().optional(),
  referenceType: z.string().optional().default("MANUAL"),
  referenceId: z.string().optional(),
  entryDate: z.string().optional(),
  lines: z.array(createJournalLineSchema).min(2, "Journal entry must have at least 2 lines")
}).refine((data) => {
  const totalDebit = data.lines.reduce((sum, line) => sum + line.debit, 0);
  const totalCredit = data.lines.reduce((sum, line) => sum + line.credit, 0);
  // Allow small rounding tolerance of 0.01 for currency calculations
  return Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;
}, {
  message: "Double-entry accounting violation: Total Debits must equal Total Credits, and must be greater than zero.",
  path: ["lines"]
});

export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;

export const uploadTransactionsSchema = z.object({
  entries: z.array(createJournalEntrySchema).min(1, "At least one journal entry must be provided")
});

export type UploadTransactionsInput = z.infer<typeof uploadTransactionsSchema>;

export const reconcileAccountSchema = z.object({
  accountId: z.string().optional(),
  statementBalance: z.coerce.number().optional(),
  asOfDate: z.string().optional()
});

export type ReconcileAccountInput = z.infer<typeof reconcileAccountSchema>;
