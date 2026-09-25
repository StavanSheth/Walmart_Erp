import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import { calculateStockStatus } from "../src/inventory/inventory.service.js";

describe("Phase 6 Inventory Service & Endpoint Tests", () => {
  // ==========================================================================
  // Unit Tests: Business Logic & Calculations
  // ==========================================================================
  describe("Stock Status Calculation Unit Tests", () => {
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
  });

  // ==========================================================================
  // Integration Tests: API Endpoints
  // ==========================================================================
  describe("API Endpoint Tests", () => {
    it("1. GET /api/inventory returns real database-backed inventory data", async () => {
      const app = buildApp({ checkDb: async () => true });

      const response = await app.inject({
        method: "GET",
        url: "/api/inventory"
      });

      assert.equal(response.statusCode, 200);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, true);
      assert.ok(body.data);

      // Summary
      assert.ok(typeof body.data.summary.totalProducts === "number");
      assert.ok(typeof body.data.summary.inventoryValue === "number");
      assert.ok(typeof body.data.summary.totalUnits === "number");
      assert.ok(typeof body.data.summary.inTransitItems === "number");

      // Analytics
      assert.ok(Array.isArray(body.data.analytics.inventoryTrend));
      assert.ok(Array.isArray(body.data.analytics.categoryDistribution));
      assert.ok(Array.isArray(body.data.analytics.storeSummary));
      assert.ok(body.data.analytics.stockStatus);

      // Verify authentic trend metrics
      for (const point of body.data.analytics.inventoryTrend) {
        assert.ok(!isNaN(point.inventoryValue));
        assert.ok(!isNaN(point.units));
        assert.ok(!isNaN(point.skuCount));
      }

      // Products & database pagination
      assert.ok(Array.isArray(body.data.products.items));
      assert.ok(body.data.products.pagination);
      assert.ok(body.data.products.pagination.total > 0);
      assert.equal(body.data.products.pagination.page, 1);
      assert.equal(body.data.products.pagination.pageSize, 25);

      // Business rule verification: available = onHand - reserved
      for (const item of body.data.products.items) {
        assert.equal(item.available, item.onHand - item.reserved);
        assert.equal(item.inventoryValue, item.onHand * item.costPrice);
      }

      // Filter Options
      assert.ok(Array.isArray(body.data.filterOptions.stores));
      assert.ok(Array.isArray(body.data.filterOptions.categories));
      assert.ok(Array.isArray(body.data.filterOptions.regions));

      await app.close();
    });

    it("2. GET /api/inventory/summary returns standalone summary metrics", async () => {
      const app = buildApp({ checkDb: async () => true });

      const response = await app.inject({
        method: "GET",
        url: "/api/inventory/summary"
      });

      assert.equal(response.statusCode, 200);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, true);
      assert.ok(typeof body.data.totalProducts === "number");
      assert.ok(typeof body.data.lowStockItems === "number");
      assert.ok(typeof body.data.outOfStockItems === "number");
      assert.ok(typeof body.data.inventoryValue === "number");
      assert.ok(typeof body.data.totalUnits === "number");

      await app.close();
    });

    it("3. GET /api/inventory/analytics returns standalone analytics metrics", async () => {
      const app = buildApp({ checkDb: async () => true });

      const response = await app.inject({
        method: "GET",
        url: "/api/inventory/analytics"
      });

      assert.equal(response.statusCode, 200);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, true);
      assert.ok(Array.isArray(body.data.inventoryTrend));
      assert.ok(Array.isArray(body.data.categoryDistribution));
      assert.ok(Array.isArray(body.data.storeSummary));
      assert.ok(body.data.stockStatus);

      await app.close();
    });

    it("4. GET /api/inventory?status=LOW_STOCK filters items by status", async () => {
      const app = buildApp({ checkDb: async () => true });

      const response = await app.inject({
        method: "GET",
        url: "/api/inventory?status=LOW_STOCK"
      });

      assert.equal(response.statusCode, 200);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, true);
      for (const item of body.data.products.items) {
        assert.equal(item.status, "LOW_STOCK");
      }

      await app.close();
    });

    it("5. GET /api/inventory?storeId=store-del-001 filters by store", async () => {
      const app = buildApp({ checkDb: async () => true });

      const response = await app.inject({
        method: "GET",
        url: "/api/inventory?storeId=store-del-001"
      });

      assert.equal(response.statusCode, 200);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, true);
      for (const item of body.data.products.items) {
        assert.equal(item.storeId, "store-del-001");
      }

      await app.close();
    });

    it("6. GET /api/inventory?search=Rice filters items by search query", async () => {
      const app = buildApp({ checkDb: async () => true });

      const response = await app.inject({
        method: "GET",
        url: "/api/inventory?search=Rice"
      });

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

    it("7. GET /api/inventory supports true database pagination (page & pageSize)", async () => {
      const app = buildApp({ checkDb: async () => true });

      const response = await app.inject({
        method: "GET",
        url: "/api/inventory?page=2&pageSize=10"
      });

      assert.equal(response.statusCode, 200);

      const body = JSON.parse(response.payload);
      assert.equal(body.success, true);
      assert.equal(body.data.products.pagination.page, 2);
      assert.equal(body.data.products.pagination.pageSize, 10);
      assert.ok(body.data.products.items.length <= 10);

      await app.close();
    });

    it("8. GET /api/inventory/:id returns detail data with recent movements", async () => {
      const app = buildApp({ checkDb: async () => true });

      const listRes = await app.inject({
        method: "GET",
        url: "/api/inventory?pageSize=1"
      });
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

      await app.close();
    });

    it("9. GET /api/inventory/:id returns 404 for non-existent inventory ID", async () => {
      const app = buildApp({ checkDb: async () => true });

      const detailRes = await app.inject({
        method: "GET",
        url: "/api/inventory/non-existent-id-99999"
      });

      assert.equal(detailRes.statusCode, 404);
      const body = JSON.parse(detailRes.payload);
      assert.equal(body.success, false);
      assert.ok(body.error);

      await app.close();
    });

    it("10. GET /api/inventory rejects invalid query parameters with 400", async () => {
      const app = buildApp({ checkDb: async () => true });

      const response = await app.inject({
        method: "GET",
        url: "/api/inventory?page=-5"
      });

      assert.equal(response.statusCode, 400);
      const body = JSON.parse(response.payload);
      assert.equal(body.success, false);
      assert.equal(body.error.code, "VALIDATION_ERROR");

      await app.close();
    });
  });
});
