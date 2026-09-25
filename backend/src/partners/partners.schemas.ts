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

export const partnerTypeEnum = z.enum(["SUPPLIER", "WHOLESALER", "DISTRIBUTOR", "VENDOR"]);
export type PartnerTypeEnum = z.infer<typeof partnerTypeEnum>;

export const createPartnerBodySchema = z.object({
  name: z.string().trim().min(2, "Partner name must be at least 2 characters"),
  type: partnerTypeEnum,
  contactPerson: z.string().trim().optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .optional()
    .nullable()
    .or(z.literal("")),
  address: z.string().trim().optional().nullable(),
  taxId: z.string().trim().optional().nullable(),
  creditLimit: z.coerce.number().min(0, "Credit limit must be positive").default(0)
});

export type CreatePartnerBody = z.infer<typeof createPartnerBodySchema>;

export const partnersExportQuerySchema = z.object({
  tab: partnersTabSchema.optional().default("overview"),
  search: z.string().trim().optional(),
  type: z.string().trim().optional(),
  regionId: z.string().trim().optional(),
  status: partnerStatusFilterSchema.optional().default("ALL")
});

export type PartnersExportQueryParams = z.infer<typeof partnersExportQuerySchema>;
