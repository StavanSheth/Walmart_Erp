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

    const {
      summary,
      mobileSummary,
      salesOverview,
      inventoryDistribution,
      orderFulfillment,
      storePerformance,
      recentInventoryActivity,
      topCategories,
      alerts,
      recentTransactions
    } = body.data;

    // Desktop 5 KPI summary validation
    assert.ok(summary.totalProducts > 0, "totalProducts must be > 0");
    assert.ok(summary.inStockUnits > 0, "inStockUnits must be > 0");
    assert.ok(typeof summary.lowStockItems === "number", "lowStockItems must be number");
    assert.ok(typeof summary.outOfStockItems === "number", "outOfStockItems must be number");
    assert.ok(summary.totalStores > 0, "totalStores must be > 0");

    // Mobile 2x2 summary validation
    assert.ok(typeof mobileSummary.totalSalesToday === "number", "totalSalesToday must be number");
    assert.ok(mobileSummary.totalOrders > 0, "totalOrders must be > 0");
    assert.ok(mobileSummary.activeStores > 0, "activeStores must be > 0");
    assert.ok(mobileSummary.inventoryValue > 0, "inventoryValue must be > 0");

    // Sales Overview validation
    assert.ok(typeof salesOverview.totalSales === "number", "totalSales must be number");
    assert.ok(Array.isArray(salesOverview.sales), "sales series must be array");
    assert.ok(Array.isArray(salesOverview.purchases), "purchases series must be array");
    assert.ok(salesOverview.sales.length > 0, "sales series should have points");

    // Inventory Distribution validation
    assert.ok(inventoryDistribution.totalUnits > 0, "totalUnits must be > 0");
    assert.ok(inventoryDistribution.inStockPercentage > 0, "inStockPercentage must be > 0");

    // Order Fulfillment validation
    assert.ok(orderFulfillment.fulfilled > 0, "fulfilled must be > 0");
    assert.ok(typeof orderFulfillment.fulfillmentRate === "number", "fulfillmentRate must be number");

    // Store Performance validation
    assert.ok(Array.isArray(storePerformance), "storePerformance must be array");
    assert.ok(storePerformance.length > 0, "storePerformance must have items");
    assert.equal(storePerformance[0].rank, 1);
    assert.ok(storePerformance[0].relativePercentage > 0);

    // Recent Inventory Activity validation
    assert.ok(Array.isArray(recentInventoryActivity), "recentInventoryActivity must be array");
    assert.ok(recentInventoryActivity.length > 0, "should have activity");

    // Top Categories validation
    assert.ok(Array.isArray(topCategories), "topCategories must be array");
    assert.ok(topCategories.length > 0, "should have top categories");

    // Alerts validation
    assert.ok(Array.isArray(alerts), "alerts must be array");
    assert.ok(alerts.length > 0, "should have alerts");

    // Recent Transactions validation
    assert.ok(Array.isArray(recentTransactions), "recentTransactions must be array");
    assert.ok(recentTransactions.length > 0, "should have transactions");

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
    assert.equal(body.data.summary.totalStores, 1);
    assert.equal(body.data.storePerformance.length, 1);
    assert.equal(body.data.storePerformance[0].storeId, "store-del-001");

    await app.close();
  });
});
