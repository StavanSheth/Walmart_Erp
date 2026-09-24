import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";

describe("Phase 5 Dashboard Endpoint Tests", () => {
  test("1. GET /api/dashboard/overview returns real database-backed overview data", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/api/dashboard/overview"
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.payload);
    assert.equal(body.success, true);
    assert.ok(body.data, "Response should have data field");

    // Summary validation
    const { summary, salesTrend, storePerformance, inventorySummary, recentSales } = body.data;
    assert.ok(typeof summary.grossSales === "number", "grossSales must be a number");
    assert.ok(typeof summary.netSales === "number", "netSales must be a number");
    assert.ok(typeof summary.orders === "number", "orders must be a number");
    assert.ok(typeof summary.averageOrderValue === "number", "AOV must be a number");
    assert.ok(summary.activeStores > 0, "activeStores must be > 0");
    assert.ok(summary.totalSkus > 0, "totalSkus must be > 0");

    // Math consistency
    if (summary.orders > 0) {
      assert.ok(summary.averageOrderValue > 0, "AOV should be > 0 when orders exist");
    }

    // Sales trend validation
    assert.ok(Array.isArray(salesTrend), "salesTrend must be an array");
    assert.ok(salesTrend.length > 0, "salesTrend should have points from seed data");
    for (const point of salesTrend) {
      assert.ok(typeof point.date === "string", "point date must be string");
      assert.ok(typeof point.sales === "number", "point sales must be number");
      assert.ok(typeof point.orders === "number", "point orders must be number");
    }

    // Store performance validation
    assert.ok(Array.isArray(storePerformance), "storePerformance must be an array");
    assert.ok(storePerformance.length > 0, "storePerformance should contain stores");
    for (const sp of storePerformance) {
      assert.ok(typeof sp.storeId === "string", "storeId must be string");
      assert.ok(typeof sp.storeName === "string", "storeName must be string");
      assert.ok(typeof sp.sales === "number", "sales must be number");
      assert.ok(typeof sp.orders === "number", "orders must be number");
      assert.ok(typeof sp.averageOrderValue === "number", "AOV must be number");
    }

    // Inventory summary validation
    assert.ok(inventorySummary.totalProducts > 0, "totalProducts must be > 0");
    assert.ok(inventorySummary.totalUnits > 0, "totalUnits must be > 0");
    assert.ok(inventorySummary.inventoryValue > 0, "inventoryValue must be > 0");
    assert.ok(typeof inventorySummary.lowStockCount === "number", "lowStockCount must be number");
    assert.ok(typeof inventorySummary.outOfStockCount === "number", "outOfStockCount must be number");

    // Recent sales validation
    assert.ok(Array.isArray(recentSales), "recentSales must be an array");
    assert.ok(recentSales.length > 0, "recentSales should contain orders");
    for (const sale of recentSales) {
      assert.ok(typeof sale.orderId === "string", "orderId must be string");
      assert.ok(typeof sale.orderNumber === "string", "orderNumber must be string");
      assert.ok(typeof sale.storeName === "string", "storeName must be string");
      assert.ok(typeof sale.customerName === "string", "customerName must be string");
      assert.ok(typeof sale.total === "number", "total must be number");
      assert.ok(typeof sale.status === "string", "status must be string");
      assert.ok(typeof sale.createdAt === "string", "createdAt must be string");
    }

    await app.close();
  });

  test("2. GET /api/dashboard/overview filters by storeId when provided", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/api/dashboard/overview?storeId=store-del-001"
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    assert.equal(body.success, true);
    assert.equal(body.data.summary.activeStores, 1);
    assert.equal(body.data.storePerformance.length, 1);
    assert.equal(body.data.storePerformance[0].storeId, "store-del-001");

    await app.close();
  });
});
