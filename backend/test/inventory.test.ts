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

    // Verify no fake trends
    for (const point of body.data.analytics.inventoryTrend) {
      assert.ok(!isNaN(point.inventoryValue));
      assert.ok(!isNaN(point.units));
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

  it("4. GET /api/inventory supports true database pagination (page & pageSize)", async () => {
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

  it("5. GET /api/inventory/:id returns detail data with recent movements", async () => {
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
});
