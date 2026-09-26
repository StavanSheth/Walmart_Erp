import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ApiClient } from "../src/lib/api/client";

describe("Frontend Stores API Client Unit Tests", () => {
  test("1. getStoresOverview formats query parameters and parses overview response", async () => {
    const originalFetch = globalThis.fetch;
    try {
      globalThis.fetch = async (input: RequestInfo | URL) => {
        const urlStr = String(input);
        assert.ok(urlStr.includes("/stores/overview"), "URL should include /stores/overview");
        assert.ok(urlStr.includes("regionId=region-north"), "Should pass regionId param");
        assert.ok(urlStr.includes("period=30d"), "Should pass period param");

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              summary: {
                totalStores: 2,
                operationalStores: 1,
                maintenanceStores: 1,
                newStores: 1,
                trends: {
                  totalStoresChangePct: null,
                  operationalChangePct: null,
                  maintenanceChangePct: null,
                  newStoresChangePct: null
                }
              },
              geoQuality: {
                totalStores: 2,
                mappedStores: 2,
                unmappedStores: 0
              },
              regions: [],
              network: [],
              topPerformers: [],
              performance: {
                period: "30d",
                salesRevenue: 29749.88,
                salesRevenueChangePct: null,
                unitsSold: 120,
                unitsSoldChangePct: null,
                inventoryFillRate: 98.5,
                inventoryFillRateChangePct: null,
                activeStoresCount: 1
              },
              alerts: []
            }
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      };

      const client = new ApiClient("http://localhost:4000/api");
      const res = await client.getStoresOverview({
        regionId: "region-north",
        period: "30d"
      });

      assert.equal(res.success, true);
      assert.equal(res.data.summary.totalStores, 2);
      assert.equal(res.data.summary.maintenanceStores, 1);
      assert.equal(res.data.performance.salesRevenue, 29749.88);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("2. getStoresNetwork returns lightweight map points", async () => {
    const originalFetch = globalThis.fetch;
    try {
      globalThis.fetch = async (input: RequestInfo | URL) => {
        const urlStr = String(input);
        assert.ok(urlStr.includes("/stores/network"), "URL should include /stores/network");

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              stores: [
                {
                  id: "store-del-001",
                  name: "Walmart Delhi Connaught Place",
                  code: "WAL-DEL-001",
                  latitude: 28.6315,
                  longitude: 77.2167,
                  status: "ACTIVE",
                  city: "New Delhi",
                  state: "Delhi",
                  region: { id: "region-north", name: "North India" },
                  salesRevenue: 16576.12,
                  inventoryValue: 45000,
                  isNewThisYear: true
                }
              ]
            }
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      };

      const client = new ApiClient("http://localhost:4000/api");
      const res = await client.getStoresNetwork();

      assert.equal(res.success, true);
      assert.equal(res.data.stores.length, 1);
      assert.equal(res.data.stores[0].latitude, 28.6315);
      assert.equal(res.data.stores[0].longitude, 77.2167);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("3. getStoreDetail loads store by ID", async () => {
    const originalFetch = globalThis.fetch;
    try {
      globalThis.fetch = async (input: RequestInfo | URL) => {
        const urlStr = String(input);
        assert.ok(urlStr.includes("/stores/store-mum-001"), "URL should include store ID");

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              store: {
                id: "store-mum-001",
                name: "Walmart Mumbai Andheri",
                code: "WAL-MUM-001",
                status: "ACTIVE"
              },
              metrics: {
                salesRevenue: 33304.07,
                completedOrders: 4,
                averageOrderValue: 8326.02,
                totalSkus: 60,
                totalUnits: 1500,
                inventoryValuation: 120000,
                lowStockCount: 2
              },
              recentOrders: [],
              lowStockItems: []
            }
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      };

      const client = new ApiClient("http://localhost:4000/api");
      const res = await client.getStoreDetail("store-mum-001");

      assert.equal(res.success, true);
      assert.equal(res.data.store.id, "store-mum-001");
      assert.equal(res.data.metrics.salesRevenue, 33304.07);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
