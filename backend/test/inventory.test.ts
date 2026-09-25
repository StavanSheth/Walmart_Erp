import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import {
  calculateAvailableStock,
  calculateStockStatus,
  calculateInventoryValue,
  calculateHealthScore,
  calculateStoreStatus
} from "../src/inventory/inventory.service.js";

describe("Phase 6 Inventory Service & Endpoint Tests", () => {
  // ==========================================================================
  // Unit Tests: Business Logic & Calculations
  // ==========================================================================
  describe("Stock Status & Calculation Unit Tests", () => {
    it("calculates available stock as onHand - reserved", () => {
      assert.equal(calculateAvailableStock(100, 20), 80);
      assert.equal(calculateAvailableStock(50, 50), 0);
      assert.equal(calculateAvailableStock(30, 40), 0);
    });

    it("calculates inventory value as quantity * costPrice (never selling price)", () => {
      assert.equal(calculateInventoryValue(10, 25.5), 255);
      assert.equal(calculateInventoryValue(0, 50), 0);
    });

    it("returns OUT_OF_STOCK when available is 0 or negative", () => {
      assert.equal(calculateStockStatus(0, 10), "OUT_OF_STOCK");
      assert.equal(calculateStockStatus(-5, 10), "OUT_OF_STOCK");
    });

    it("returns LOW_STOCK when available is positive but less than or equal to reorderLevel", () => {
      assert.equal(calculateStockStatus(5, 10), "LOW_STOCK");
      assert.equal(calculateStockStatus(10, 10), "LOW_STOCK");
      assert.equal(calculateStockStatus(1, 10), "LOW_STOCK");
    });

    it("returns IN_STOCK when available is strictly greater than reorderLevel", () => {
      assert.equal(calculateStockStatus(11, 10), "IN_STOCK");
      assert.equal(calculateStockStatus(100, 10), "IN_STOCK");
    });

    it("calculates health score deterministically clamped between 0 and 100", () => {
      const healthy = calculateHealthScore(90, 10, 0);
      assert.equal(healthy.healthRating, "Good");
      assert.ok(healthy.healthScore >= 80);

      const warning = calculateHealthScore(50, 30, 20);
      assert.ok(warning.healthScore <= 79);

      const critical = calculateHealthScore(10, 40, 50);
      assert.equal(critical.healthRating, "Needs Attention");
      assert.ok(critical.healthScore < 60);
    });

    it("calculates store health status as Healthy or Watch based on issue ratio", () => {
      assert.equal(calculateStoreStatus(1, 0, 10), "Healthy"); // 10% issue ratio < 0.25
      assert.equal(calculateStoreStatus(3, 2, 10), "Watch"); // 50% issue ratio >= 0.25
    });
  });

  // ==========================================================================
  // Integration Tests: API Endpoints
  // ==========================================================================
  describe("API Endpoint Tests", () => {
    it("1. GET /api/inventory returns 200", async () => {
      const app = buildApp({ checkDb: async () => true });
      const response = await app.inject({ method: "GET", url: "/api/inventory" });
      assert.equal(response.statusCode, 200);
      await app.close();
    });

    it("2. default response structure contains summary, analytics, products, recentMovements, filterOptions", async () => {
      const app = buildApp({ checkDb: async () => true });
      const response = await app.inject({ method: "GET", url: "/api/inventory" });
      const body = JSON.parse(response.payload);

      assert.equal(body.success, true);
      assert.ok(body.data);

      // Summary
      assert.ok(typeof body.data.summary.totalProducts === "number");
      assert.ok(typeof body.data.summary.inventoryValue === "number");
      assert.ok(typeof body.data.summary.totalUnits === "number");
      assert.ok(typeof body.data.summary.lowStockItems === "number");
      assert.ok(typeof body.data.summary.outOfStockItems === "number");
      assert.ok(typeof body.data.summary.inTransitItems === "number");

      // Analytics
      assert.ok(Array.isArray(body.data.analytics.inventoryTrend));
      assert.ok(Array.isArray(body.data.analytics.categoryDistribution));
      assert.ok(Array.isArray(body.data.analytics.storeSummary));
      assert.ok(body.data.analytics.stockStatus);

      // Products & pagination
      assert.ok(Array.isArray(body.data.products.items));
      assert.ok(body.data.products.pagination);
      assert.ok(body.data.products.pagination.total > 0);
      assert.equal(body.data.products.pagination.page, 1);
      assert.equal(body.data.products.pagination.pageSize, 25);

      // Business rule verification: available = onHand - reserved & inventoryValue = onHand * costPrice
      for (const item of body.data.products.items) {
        assert.equal(item.available, item.onHand - item.reserved);
        assert.equal(item.inventoryValue, item.onHand * item.costPrice);
      }

      // Recent movements
      assert.ok(Array.isArray(body.data.recentMovements));
      assert.ok(body.data.recentMovements.length <= 10);

      // Filter options
      assert.ok(Array.isArray(body.data.filterOptions.stores));
      assert.ok(Array.isArray(body.data.filterOptions.categories));
      assert.ok(Array.isArray(body.data.filterOptions.regions));

      await app.close();
    });

    it("3. search filtering filters items by product name, sku, or barcode", async () => {
      const app = buildApp({ checkDb: async () => true });
      const response = await app.inject({ method: "GET", url: "/api/inventory?search=Rice" });
      assert.equal(response.statusCode, 200);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, true);
      assert.ok(body.data.products.items.length > 0);
      for (const item of body.data.products.items) {
        const matches =
          item.productName.toLowerCase().includes("rice") ||
          item.sku.toLowerCase().includes("rice") ||
          (item.barcode && item.barcode.toLowerCase().includes("rice"));
        assert.ok(matches);
      }
      await app.close();
    });

    it("4. region filtering scopes inventory to stores in the selected region", async () => {
      const app = buildApp({ checkDb: async () => true });
      const listRes = await app.inject({ method: "GET", url: "/api/inventory" });
      const regions = JSON.parse(listRes.payload).data.filterOptions.regions;
      assert.ok(regions.length > 0);

      const targetRegion = regions[0];
      const response = await app.inject({ method: "GET", url: `/api/inventory?regionId=${targetRegion.id}` });
      assert.equal(response.statusCode, 200);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, true);
      assert.ok(body.data.summary.totalProducts > 0);
      await app.close();
    });

    it("5. store filtering filters items by storeId", async () => {
      const app = buildApp({ checkDb: async () => true });
      const response = await app.inject({ method: "GET", url: "/api/inventory?storeId=store-del-001" });
      assert.equal(response.statusCode, 200);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, true);
      for (const item of body.data.products.items) {
        assert.equal(item.storeId, "store-del-001");
      }
      await app.close();
    });

    it("6. category filtering filters items by categoryId", async () => {
      const app = buildApp({ checkDb: async () => true });
      const listRes = await app.inject({ method: "GET", url: "/api/inventory" });
      const categories = JSON.parse(listRes.payload).data.filterOptions.categories;
      assert.ok(categories.length > 0);

      const targetCat = categories[0];
      const response = await app.inject({ method: "GET", url: `/api/inventory?categoryId=${targetCat.id}` });
      assert.equal(response.statusCode, 200);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, true);
      for (const item of body.data.products.items) {
        assert.equal(item.categoryId, targetCat.id);
      }
      await app.close();
    });

    it("7. status filtering filters items by stock status", async () => {
      const app = buildApp({ checkDb: async () => true });
      const response = await app.inject({ method: "GET", url: "/api/inventory?status=LOW_STOCK" });
      assert.equal(response.statusCode, 200);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, true);
      for (const item of body.data.products.items) {
        assert.equal(item.status, "LOW_STOCK");
      }
      await app.close();
    });

    it("8. pagination works with page & pageSize", async () => {
      const app = buildApp({ checkDb: async () => true });
      const response = await app.inject({ method: "GET", url: "/api/inventory?page=2&pageSize=10" });
      assert.equal(response.statusCode, 200);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, true);
      assert.equal(body.data.products.pagination.page, 2);
      assert.equal(body.data.products.pagination.pageSize, 10);
      assert.ok(body.data.products.items.length <= 10);
      await app.close();
    });

    it("9. invalid page rejects with 400", async () => {
      const app = buildApp({ checkDb: async () => true });
      const response = await app.inject({ method: "GET", url: "/api/inventory?page=-5" });
      assert.equal(response.statusCode, 400);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, false);
      assert.equal(body.error.code, "VALIDATION_ERROR");
      await app.close();
    });

    it("10. invalid pageSize rejects with 400", async () => {
      const app = buildApp({ checkDb: async () => true });
      const response = await app.inject({ method: "GET", url: "/api/inventory?pageSize=200" });
      assert.equal(response.statusCode, 400);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, false);
      assert.equal(body.error.code, "VALIDATION_ERROR");
      await app.close();
    });

    it("11. GET /api/inventory/:inventoryId returns inventory detail", async () => {
      const app = buildApp({ checkDb: async () => true });
      const listRes = await app.inject({ method: "GET", url: "/api/inventory?pageSize=1" });
      const firstItem = JSON.parse(listRes.payload).data.products.items[0];

      const detailRes = await app.inject({
        method: "GET",
        url: `/api/inventory/${firstItem.id}`
      });

      assert.equal(detailRes.statusCode, 200);
      const body = JSON.parse(detailRes.payload);
      assert.equal(body.success, true);
      assert.equal(body.data.item.id, firstItem.id);
      assert.ok(Array.isArray(body.data.recentMovements));
      assert.ok(body.data.recentMovements.length <= 10);
      await app.close();
    });

    it("12. missing inventory returns 404", async () => {
      const app = buildApp({ checkDb: async () => true });
      const detailRes = await app.inject({
        method: "GET",
        url: "/api/inventory/non-existent-id-99999"
      });

      assert.equal(detailRes.statusCode, 404);
      const body = JSON.parse(detailRes.payload);
      assert.equal(body.success, false);
      assert.ok(body.error);
      assert.equal(body.error.code, "NOT_FOUND");
      await app.close();
    });
  });
});
