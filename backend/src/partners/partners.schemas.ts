import { z } from "zod";

export const partnersTabSchema = z
  .enum(["overview", "wholesalers-retailers", "suppliers", "customers", "performance"])
  .default("overview");

export type PartnersTab = z.infer<typeof partnersTabSchema>;

export const partnerStatusFilterSchema = z.enum(["ALL", "ACTIVE", "INACTIVE"]).default("ALL");
export type PartnerStatusFilter = z.infer<typeof partnerStatusFilterSchema>;

export const partnersPeriodSchema = z.enum(["6m", "12m"]).default("6m");
export type PartnersPeriod = z.infer<typeof partnersPeriodSchema>;

export const partnersOverviewQuerySchema = z.object({
  tab: partnersTabSchema.optional().default("overview"),
  search: z.string().trim().optional(),
  type: z.string().trim().optional(),
  regionId: z.string().trim().optional(),
  status: partnerStatusFilterSchema.optional().default("ALL"),
  page: z.coerce.number().int().min(1, "page must be at least 1").default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1, "pageSize must be at least 1")
    .max(100, "pageSize maximum is 100")
    .default(10),
  period: partnersPeriodSchema.optional().default("6m")
});

export type PartnersOverviewQueryParams = z.infer<typeof partnersOverviewQuerySchema>;

export const partnerIdParamSchema = z.object({
  id: z.string().min(1, "Partner/Customer ID is required")
});

export type PartnerIdParam = z.infer<typeof partnerIdParamSchema>;
