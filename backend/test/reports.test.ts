import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";

describe("Reports Endpoint Tests", () => {
  test("1. GET /api/reports/overview returns complete aggregated report data", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/api/reports/overview?reportType=SALES&period=30d"
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.payload);
    assert.equal(body.success, true);
    assert.ok(body.data, "Response should have data field");

    const {
      kpis,
      salesTrend,
      categoryDistribution,
      quickReports,
      scheduledReports,
      generatedReports,
      filterOptions
    } = body.data;

    // KPI validations
    assert.ok(kpis.totalSales.value > 0, "totalSales must be > 0");
    assert.ok(kpis.totalOrders.value > 0, "totalOrders must be > 0");
    assert.ok(kpis.avgOrderValue.value > 0, "avgOrderValue must be > 0");
    assert.ok(kpis.totalStores.value > 0, "totalStores must be > 0");
    assert.ok(kpis.productsSold.value > 0, "productsSold must be > 0");

    // Trend series validation
    assert.equal(salesTrend.dates.length, 6, "dates must have 6 points");
    assert.equal(salesTrend.onlineSales.length, 6);
    assert.equal(salesTrend.inStoreSales.length, 6);
    assert.equal(salesTrend.wholesaleSales.length, 6);

    // Category distribution validation
    assert.ok(categoryDistribution.items.length >= 6);
    assert.equal(categoryDistribution.items[0].name, "Electronics");

    // Quick reports validation
    assert.equal(quickReports.length, 8);

    // Scheduled reports validation
    assert.equal(scheduledReports.length, 4);

    // Generated reports validation
    assert.equal(generatedReports.items.length, 10);
    assert.ok(generatedReports.total >= 48);

    // Filter options validation
    assert.ok(filterOptions.regions.length > 0);
    assert.ok(filterOptions.stores.length > 0);
    assert.ok(filterOptions.categories.length > 0);
  });

  test("2. POST /api/reports/generate creates a new report", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/api/reports/generate",
      payload: {
        name: "Q3 Executive Performance Deck",
        type: "Custom",
        dateRange: "Jul 1 – Sep 22, 2026",
        format: "CSV"
      }
    });

    assert.equal(response.statusCode, 201);
    const body = JSON.parse(response.payload);
    assert.equal(body.success, true);
    assert.equal(body.data.name, "Q3 Executive Performance Deck");
    assert.equal(body.data.status, "Completed");
  });

  test("3. PATCH /api/reports/scheduled/:id/toggle flips report toggle state", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "PATCH",
      url: "/api/reports/scheduled/sched-4/toggle",
      payload: {
        enabled: true
      }
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    assert.equal(body.success, true);
    assert.equal(body.data.enabled, true);
  });

  test("4. GET /api/reports/export returns CSV file stream", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/api/reports/export?format=CSV"
    });

    assert.equal(response.statusCode, 200);
    assert.ok(response.headers["content-type"]?.includes("text/csv"));
    assert.ok(response.payload.includes("Report Name"));
    assert.ok(response.payload.includes("Sales Summary Report"));
  });
});
