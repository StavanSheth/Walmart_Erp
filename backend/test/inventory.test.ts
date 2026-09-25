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

describe("Phase 6 Inventory - Required Business & Endpoint Verification Tests", () => {
  // ==========================================================================
  // Section 23: Business Logic & Calculation Verifications
  // ==========================================================================
  describe("Core Business Logic & Formulas", () => {
    // 14. available = onHand - reserved
    it("14. available = onHand - reserved", () => {
      assert.equal(calculateAvailableStock(100, 20), 80);
      assert.equal(calculateAvailableStock(50, 50), 0);
      assert.equal(calculateAvailableStock(30, 40), 0); // clamped to 0, never negative
    });

    // 15. inventory value = onHand * costPrice
    it("15. inventory value = onHand * costPrice", () => {
      assert.equal(calculateInventoryValue(10, 25.5), 255);
      assert.equal(calculateInventoryValue(0, 50), 0);
      assert.equal(calculateInventoryValue(100, 0), 0);
    });

    // 16. low-stock classification
    it("16. low-stock classification", () => {
      assert.equal(calculateStockStatus(5, 10), "LOW_STOCK");
      assert.equal(calculateStockStatus(10, 10), "LOW_STOCK");
      assert.equal(calculateStockStatus(1, 10), "LOW_STOCK");
      assert.equal(calculateStockStatus(11, 10), "IN_STOCK");
    });

    // 17. out-of-stock classification
    it("17. out-of-stock classification", () => {
      assert.equal(calculateStockStatus(0, 10), "OUT_OF_STOCK");
      assert.equal(calculateStockStatus(-5, 10), "OUT_OF_STOCK");
    });

    // Deterministic presentation indicators
    it("health indicators calculate deterministically", () => {
      const healthy = calculateHealthScore(90, 10, 0);
      assert.equal(healthy.healthRating, "Good");
      assert.ok(healthy.healthScore >= 80);

      const critical = calculateHealthScore(10, 40, 50);
      assert.equal(critical.healthRating, "Needs Attention");

      assert.equal(calculateStoreStatus(1, 0, 10), "Healthy");
      assert.equal(calculateStoreStatus(3, 2, 10), "Watch");
    });
  });

  // ==========================================================================
  // Section 23: Integration API Endpoints Tests (1 through 13)
  // ==========================================================================
  describe("API Endpoints & Filtering", () => {
    // 1. GET /api/inventory -> 200
    it("1. GET /api/inventory -> 200", async () => {
      const app = buildApp({ checkDb: async () => true });
      const response = await app.inject({ method: "GET", url: "/api/inventory" });
      assert.equal(response.statusCode, 200);
      await app.close();
    });

    // 2. Default response structure
    it("2. default response structure", async () => {
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

    // 3. Search
    it("3. search", async () => {
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

    // 4. Store filter
    it("4. store filter", async () => {
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

    // 5. Category filter
    it("5. category filter", async () => {
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

    // 6. Status filter
    it("6. status filter", async () => {
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

    // 7. Combined filters
    it("7. combined filters", async () => {
      const app = buildApp({ checkDb: async () => true });
      const listRes = await app.inject({ method: "GET", url: "/api/inventory" });
      const filterOptions = JSON.parse(listRes.payload).data.filterOptions;
      const targetStore = filterOptions.stores[0];
      const targetCategory = filterOptions.categories[0];

      const response = await app.inject({
        method: "GET",
        url: `/api/inventory?storeId=${targetStore.id}&categoryId=${targetCategory.id}&status=ALL`
      });
      assert.equal(response.statusCode, 200);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, true);
      for (const item of body.data.products.items) {
        assert.equal(item.storeId, targetStore.id);
        assert.equal(item.categoryId, targetCategory.id);
      }
      await app.close();
    });

    // 8. Pagination
    it("8. pagination", async () => {
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

    // 9. Invalid page
    it("9. invalid page", async () => {
      const app = buildApp({ checkDb: async () => true });
      const response = await app.inject({ method: "GET", url: "/api/inventory?page=-5" });
      assert.equal(response.statusCode, 400);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, false);
      assert.equal(body.error.code, "VALIDATION_ERROR");
      await app.close();
    });

    // 10. Invalid pageSize
    it("10. invalid pageSize", async () => {
      const app = buildApp({ checkDb: async () => true });
      const response = await app.inject({ method: "GET", url: "/api/inventory?pageSize=200" });
      assert.equal(response.statusCode, 400);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, false);
      assert.equal(body.error.code, "VALIDATION_ERROR");
      await app.close();
    });

    // 11. Invalid status
    it("11. invalid status", async () => {
      const app = buildApp({ checkDb: async () => true });
      const response = await app.inject({ method: "GET", url: "/api/inventory?status=INVALID_STATUS" });
      assert.equal(response.statusCode, 400);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, false);
      assert.equal(body.error.code, "VALIDATION_ERROR");
      await app.close();
    });

    // 12. GET /api/inventory/:id -> valid ID
    it("12. GET /api/inventory/:id -> valid ID", async () => {
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

    // 13. GET /api/inventory/:id -> nonexistent ID -> 404
    it("13. GET /api/inventory/:id -> nonexistent ID -> 404", async () => {
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
