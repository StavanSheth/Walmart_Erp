import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";

describe("Phase 8 Stores / Store Network Endpoint Tests", () => {
  const app = buildApp();

  test("1. GET /api/stores/overview returns real database-backed overview data", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/stores/overview"
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    assert.equal(body.success, true);
    assert.ok(body.data, "Should have data payload");

    const { summary, geoQuality, regions, network, topPerformers, performance, alerts } = body.data;

    // Verify KPI summary
    assert.equal(summary.totalStores, 8, "Expected 8 total stores in demo dataset");
    assert.equal(summary.operationalStores, 7, "Expected 7 operational stores (1 in maintenance)");
    assert.equal(summary.maintenanceStores, 1, "Expected 1 store under maintenance");
    assert.ok(summary.newStores >= 0, "newStores must be >= 0");

    // Verify Geo Quality
    assert.equal(geoQuality.totalStores, 8);
    assert.equal(geoQuality.mappedStores, 7, "Expected 7 stores with valid coordinates");
    assert.equal(geoQuality.unmappedStores, 1, "Expected 1 store without coordinates (Guwahati)");

    // Verify Regions
    assert.ok(Array.isArray(regions), "regions must be an array");
    assert.equal(regions.length, 4, "Expected 4 regions");
    assert.ok(regions.every((r: { storeCount: number }) => r.storeCount > 0), "Each region should have stores");

    // Verify Network Points
    assert.ok(Array.isArray(network), "network must be an array");
    assert.equal(network.length, 8);
    const mapped = network.filter((p: { latitude: number | null; longitude: number | null }) => p.latitude != null && p.longitude != null);
    assert.equal(mapped.length, 7);

    // Verify Top Performers
    assert.ok(Array.isArray(topPerformers), "topPerformers must be an array");
    assert.ok(topPerformers.length <= 3, "Max 3 top performers");
    assert.ok(topPerformers.length > 0, "Should have top performers");
    for (let i = 0; i < topPerformers.length - 1; i++) {
      assert.ok(
        topPerformers[i].salesRevenue >= topPerformers[i + 1].salesRevenue,
        "Top performers must be sorted by salesRevenue descending"
      );
    }

    // Verify Performance Panel
    assert.equal(performance.period, "30d");
    assert.ok(performance.salesRevenue > 0, "salesRevenue must be positive");
    assert.ok(performance.unitsSold > 0, "unitsSold must be positive");
    assert.ok(performance.inventoryFillRate >= 0 && performance.inventoryFillRate <= 100);

    // Verify Alerts
    assert.ok(Array.isArray(alerts), "alerts must be an array");
    assert.ok(alerts.length > 0, "alerts should be generated from real data");
    assert.ok(
      alerts.some((a: { type: string }) => a.type === "MAINTENANCE"),
      "Should have a maintenance alert for the store under maintenance"
    );
  });

  test("2. Region filtering scopes overview and network correctly", async () => {
    // Test region-north
    const response = await app.inject({
      method: "GET",
      url: "/api/stores/overview?regionId=region-north"
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    assert.equal(body.success, true);

    const { summary, network } = body.data;
    assert.equal(summary.totalStores, 2, "North region has 2 stores (Delhi and Jaipur)");
    assert.equal(summary.operationalStores, 1, "Delhi is ACTIVE");
    assert.equal(summary.maintenanceStores, 1, "Jaipur is MAINTENANCE");

    assert.equal(network.length, 2);
    assert.ok(network.every((p: { code: string }) => p.code.includes("DEL") || p.code.includes("JPR")));
  });

  test("3. Status filtering works on overview and network", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/stores/overview?status=MAINTENANCE"
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    assert.equal(body.success, true);

    const { network } = body.data;
    assert.equal(network.length, 1);
    assert.equal(network[0].code, "WAL-JPR-001");
    assert.equal(network[0].status, "MAINTENANCE");
  });

  test("4. Search works across name, code, and city", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/stores/overview?search=Mumbai"
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    assert.equal(body.success, true);

    const { network } = body.data;
    assert.equal(network.length, 1);
    assert.equal(network[0].name, "Walmart Mumbai Andheri");
    assert.equal(network[0].city, "Mumbai");
  });

  test("5. GET /api/stores/network returns lightweight map coordinates", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/stores/network"
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data.stores));
    assert.equal(body.data.stores.length, 8);

    const first = body.data.stores[0];
    assert.ok("latitude" in first);
    assert.ok("longitude" in first);
    assert.ok("status" in first);
    assert.ok("code" in first);
    assert.ok("name" in first);
    assert.ok("salesRevenue" in first);
    assert.ok("inventoryValue" in first);
  });

  test("6. GET /api/stores returns paginated store list with metadata", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/stores?pageSize=4&page=1"
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    assert.equal(body.success, true);
    assert.equal(body.data.length, 4);
    assert.equal(body.meta.total, 8);
    assert.equal(body.meta.page, 1);
    assert.equal(body.meta.pageSize, 4);
    assert.equal(body.meta.totalPages, 2);
  });

  test("7. GET /api/stores/:id returns comprehensive store detail", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/stores/store-del-001"
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    assert.equal(body.success, true);

    const { store, metrics, recentOrders } = body.data;
    assert.equal(store.id, "store-del-001");
    assert.equal(store.name, "Walmart Delhi Connaught Place");
    assert.ok(store.region, "Store should include region relation");
    assert.ok(store.manager, "Store should include manager relation");

    assert.ok(typeof metrics.salesRevenue === "number");
    assert.ok(typeof metrics.inventoryValuation === "number");
    assert.ok(typeof metrics.totalSkus === "number");
    assert.ok(Array.isArray(recentOrders));
  });

  test("8. GET /api/stores/:id returns 404 for non-existent store", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/stores/non-existent-store-xyz"
    });

    assert.equal(response.statusCode, 404);
  });
});
