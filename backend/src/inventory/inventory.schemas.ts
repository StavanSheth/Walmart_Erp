import { z } from "zod";

export const stockStatusSchema = z.enum(["ALL", "IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"]);
export type StockStatus = z.infer<typeof stockStatusSchema>;

export const inventoryTabSchema = z.enum(["all", "most-stocked", "low-stock", "out-of-stock"]).default("all");
export type InventoryTab = z.infer<typeof inventoryTabSchema>;

export const inventoryQuerySchema = z.object({
  regionId: z.string().trim().optional(),
  storeId: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  status: stockStatusSchema.default("ALL"),
  tab: inventoryTabSchema.optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1, "page must be at least 1").default(1),
  pageSize: z.coerce.number().int().min(1, "pageSize must be at least 1").max(100, "pageSize maximum is 100").default(25)
});

export type InventoryQueryParams = z.infer<typeof inventoryQuerySchema>;

export const inventoryIdParamSchema = z.object({
  id: z.string().min(1, "Inventory ID is required").optional(),
  inventoryId: z.string().min(1, "Inventory ID is required").optional()
});

export type InventoryIdParam = z.infer<typeof inventoryIdParamSchema>;
