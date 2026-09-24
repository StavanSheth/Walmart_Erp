import { z } from "zod";

export const dashboardQuerySchema = z.object({
  storeId: z.string().trim().min(1, "storeId must be non-empty").optional(),
  regionId: z.string().trim().min(1, "regionId must be non-empty").optional(),
  from: z
    .string()
    .trim()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "from must be a valid date"
    })
    .optional(),
  to: z
    .string()
    .trim()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "to must be a valid date"
    })
    .optional()
});

export type DashboardQueryParams = z.infer<typeof dashboardQuerySchema>;
