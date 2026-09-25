import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";

describe("Phase 6 Inventory Endpoint Tests", () => {
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

    // Analytics
    assert.ok(Array.isArray(body.data.analytics.inventoryTrend));
    assert.ok(Array.isArray(body.data.analytics.categoryDistribution));
    assert.ok(Array.isArray(body.data.analytics.storeSummary));
    assert.ok(body.data.analytics.stockStatus);

    // Products
    assert.ok(Array.isArray(body.data.products.items));
    assert.ok(body.data.products.pagination);
    assert.ok(body.data.products.pagination.total > 0);

    // Filter Options
    assert.ok(Array.isArray(body.data.filterOptions.stores));
    assert.ok(Array.isArray(body.data.filterOptions.categories));
    assert.ok(Array.isArray(body.data.filterOptions.regions));

    await app.close();
  });

  it("2. GET /api/inventory?status=LOW_STOCK filters items by status", async () => {
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

  it("3. GET /api/inventory?storeId=store-del-001 filters by store", async () => {
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
});
