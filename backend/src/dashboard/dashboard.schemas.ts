import { z } from "zod";

export const dashboardQuerySchema = z.object({
  storeId: z.string().trim().min(1, "storeId must be non-empty").optional(),
  period: z.enum(["today", "7d", "30d"]).default("30d")
});

export type DashboardQueryParams = z.infer<typeof dashboardQuerySchema>;

