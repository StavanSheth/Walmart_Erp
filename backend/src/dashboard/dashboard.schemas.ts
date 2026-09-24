import { z } from "zod";

export const dashboardQuerySchema = z.object({
  storeId: z.string().trim().min(1).optional(),
  regionId: z.string().trim().min(1).optional(),
  from: z.string().trim().min(1).optional(),
  to: z.string().trim().min(1).optional()
});

export type DashboardQueryParams = z.infer<typeof dashboardQuerySchema>;
