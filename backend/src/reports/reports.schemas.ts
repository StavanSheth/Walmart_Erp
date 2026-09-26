import { z } from "zod";

export const ReportsQuerySchema = z.object({
  reportType: z.enum([
    "SALES",
    "INVENTORY",
    "STORE",
    "PARTNER",
    "FINANCIAL",
    "OPERATIONAL",
    "CUSTOM"
  ]).optional().default("SALES"),
  period: z.enum(["today", "7d", "30d", "90d", "ytd", "custom"]).optional().default("30d"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  regionId: z.string().optional().default("ALL"),
  storeId: z.string().optional().default("ALL"),
  categoryId: z.string().optional().default("ALL"),
  productId: z.string().optional().default("ALL"),
  partnerType: z.string().optional().default("ALL"),
  partnerId: z.string().optional().default("ALL"),
  status: z.string().optional().default("ALL"),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10)
});

export type ReportsQueryParams = z.infer<typeof ReportsQuerySchema>;

export const GenerateReportInputSchema = z.object({
  name: z.string().min(2, "Report name is required"),
  type: z.enum(["Sales", "Inventory", "Store", "Partner", "Financial", "Operational", "Custom"]),
  dateRange: z.string().optional(),
  format: z.enum(["CSV", "JSON", "PDF", "XLSX"]).optional().default("CSV"),
  filters: z.record(z.unknown()).optional()
});

export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

export const ToggleScheduledReportSchema = z.object({
  enabled: z.boolean().optional()
});

export type ToggleScheduledReportInput = z.infer<typeof ToggleScheduledReportSchema>;
