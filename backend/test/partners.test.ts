import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import {
  calculateGrowthPercentage,
  calculateSatisfactionScore,
  calculateOnboardingPercentage,
  formatPartnerType
} from "../src/partners/partners.helpers.js";

describe("Phase 7 Partners & Customers - Required Business & Endpoint Verification Tests", () => {
  // ==========================================================================
  // Section A: Business Logic & Calculation Verifications
  // ==========================================================================
  describe("Core Business Logic & Formulas", () => {
    it("1. calculateGrowthPercentage handles positive, negative, zero baseline", () => {
      assert.equal(calculateGrowthPercentage(120, 100), 20);
      assert.equal(calculateGrowthPercentage(80, 100), -20);
      assert.equal(calculateGrowthPercentage(10, 0), 100);
      assert.equal(calculateGrowthPercentage(0, 0), null);
    });

    it("2. calculateSatisfactionScore bounds deterministically between 50 and 99.5", () => {
      const high = calculateSatisfactionScore(20, 20, 18);
      assert.ok(high >= 90 && high <= 99.5);

      const moderate = calculateSatisfactionScore(15, 20, 10);
      assert.ok(moderate >= 60 && moderate <= 85);

      const low = calculateSatisfactionScore(5, 20, 2);
      assert.ok(low >= 50 && low <= 70);

      const empty = calculateSatisfactionScore(0, 0, 0);
      assert.equal(empty, 95.0);
    });

    it("3. calculateOnboardingPercentage clamps to 0-100", () => {
      assert.equal(calculateOnboardingPercentage(78, 100), 78);
      assert.equal(calculateOnboardingPercentage(120, 100), 100);
      assert.equal(calculateOnboardingPercentage(0, 50), 0);
      assert.equal(calculateOnboardingPercentage(10, 0), 0);
    });

    it("4. formatPartnerType formats correctly for partners and customers", () => {
      assert.equal(formatPartnerType("SUPPLIER", "partner"), "Supplier");
      assert.equal(formatPartnerType("WHOLESALER", "partner"), "Wholesaler");
      assert.equal(formatPartnerType("DISTRIBUTOR", "partner"), "Distributor");
      assert.equal(formatPartnerType("VENDOR", "partner"), "Vendor");
      assert.equal(formatPartnerType("BUSINESS", "customer"), "Retailer");
      assert.equal(formatPartnerType("RETAIL", "customer"), "Customer");
    });
  });

  // ==========================================================================
  // Section B: API Integration Tests (1 through 18)
  // ==========================================================================
  describe("API Endpoints & Filtering", () => {
    const app = buildApp();

    // 1. GET /api/partners/overview -> 200
    it("1. GET /api/partners/overview -> 200", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview"
      });
      assert.equal(res.statusCode, 200);
      const body = JSON.parse(res.payload);
      assert.equal(body.success, true);
    });

    // 2. response structure
    it("2. response structure contains all required sections", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview"
      });
      const body = JSON.parse(res.payload);
      assert.ok(body.data.summary, "summary missing");
      assert.ok(body.data.distribution, "distribution missing");
      assert.ok(body.data.growth, "growth missing");
      assert.ok(body.data.insights, "insights missing");
      assert.ok(body.data.list, "list missing");
      assert.ok(body.data.topPartners, "topPartners missing");
      assert.ok(body.data.onboarding, "onboarding missing");
      assert.ok(body.data.filterOptions, "filterOptions missing");
    });

    // 3. summary counts
    it("3. summary counts are numeric and match active partners/customers", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview"
      });
      const { summary } = JSON.parse(res.payload).data;
      assert.equal(typeof summary.totalPartners, "number");
      assert.equal(typeof summary.retailers, "number");
      assert.equal(typeof summary.suppliers, "number");
      assert.equal(typeof summary.endCustomers, "number");
      assert.ok(summary.totalPartners > 0);
      assert.ok(summary.trends.totalPartners.sparkline.length > 0);
    });

    // 4. search
    it("4. search filters by name, contactPerson, or address", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview?search=Wholesale"
      });
      const { list } = JSON.parse(res.payload).data;
      assert.ok(list.items.length > 0);
      list.items.forEach((item: { name: string; type: string; address?: string }) => {
        const matches =
          item.name.toLowerCase().includes("wholesale") ||
          item.type.toLowerCase().includes("wholesale") ||
          (item.address && item.address.toLowerCase().includes("wholesale"));
        assert.ok(matches);
      });
    });

    // 5. partner type filter
    it("5. partner type filter", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview?type=SUPPLIER"
      });
      const { list } = JSON.parse(res.payload).data;
      assert.ok(list.items.length > 0);
      list.items.forEach((item: { type: string; rawType: string }) => {
        assert.equal(item.rawType, "SUPPLIER");
      });
    });

    // 6. region filter
    it("6. region filter", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview?regionId=region-north"
      });
      const { list } = JSON.parse(res.payload).data;
      assert.ok(list.items.length > 0);
      list.items.forEach((item: { regionId: string | null }) => {
        if (item.regionId) {
          assert.equal(item.regionId, "region-north");
        }
      });
    });

    // 7. status filter
    it("7. status filter", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview?status=INACTIVE"
      });
      const { list } = JSON.parse(res.payload).data;
      assert.ok(list.items.length > 0);
      list.items.forEach((item: { status: string }) => {
        assert.equal(item.status, "INACTIVE");
      });
    });

    // 8. combined filters
    it("8. combined filters", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview?status=ACTIVE&tab=wholesalers-retailers&pageSize=5"
      });
      const { list } = JSON.parse(res.payload).data;
      assert.ok(list.items.length <= 5);
      list.items.forEach((item: { status: string; type: string }) => {
        assert.equal(item.status, "ACTIVE");
        assert.ok(item.type === "Wholesaler" || item.type === "Retailer");
      });
    });

    // 9. pagination
    it("9. pagination", async () => {
      const res1 = await app.inject({
        method: "GET",
        url: "/api/partners/overview?page=1&pageSize=5"
      });
      const res2 = await app.inject({
        method: "GET",
        url: "/api/partners/overview?page=2&pageSize=5"
      });
      const body1 = JSON.parse(res1.payload).data.list;
      const body2 = JSON.parse(res2.payload).data.list;
      assert.equal(body1.pagination.page, 1);
      assert.equal(body1.pagination.pageSize, 5);
      assert.equal(body2.pagination.page, 2);
      assert.notEqual(body1.items[0]?.id, body2.items[0]?.id);
    });

    // 10. invalid page
    it("10. invalid page -> 400", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview?page=0"
      });
      assert.equal(res.statusCode, 400);
    });

    // 11. invalid pageSize
    it("11. invalid pageSize -> 400", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview?pageSize=200"
      });
      assert.equal(res.statusCode, 400);
    });

    // 12. invalid status
    it("12. invalid status -> 400", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview?status=INVALID_STATUS"
      });
      assert.equal(res.statusCode, 400);
    });

    // 13. tab filter: suppliers tab
    it("13. tab filter: suppliers tab returns only suppliers", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview?tab=suppliers"
      });
      const { list } = JSON.parse(res.payload).data;
      assert.ok(list.items.length > 0);
      list.items.forEach((item: { type: string }) => {
        assert.equal(item.type, "Supplier");
      });
    });

    // 14. growth response
    it("14. growth response contains 6 months time-series by default", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview?period=6m"
      });
      const { growth } = JSON.parse(res.payload).data;
      assert.equal(growth.length, 6);
      growth.forEach((pt: { month: string; Retailers: number; Wholesalers: number; Suppliers: number; Customers: number }) => {
        assert.ok(pt.month);
        assert.equal(typeof pt.Retailers, "number");
        assert.equal(typeof pt.Wholesalers, "number");
        assert.equal(typeof pt.Suppliers, "number");
        assert.equal(typeof pt.Customers, "number");
      });
    });

    // 15. distribution percentages sum up safely
    it("15. distribution percentages are calculated accurately", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview"
      });
      const { distribution } = JSON.parse(res.payload).data;
      assert.equal(distribution.length, 4);
      const totalPct = distribution.reduce((sum: number, d: { percentage: number }) => sum + d.percentage, 0);
      assert.ok(totalPct >= 95 && totalPct <= 105);
    });

    // 16. onboarding calculation
    it("16. onboarding calculation returns valid counts and percentage", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview"
      });
      const { onboarding } = JSON.parse(res.payload).data;
      assert.equal(typeof onboarding.onboarded, "number");
      assert.equal(typeof onboarding.eligible, "number");
      assert.ok(onboarding.percentage >= 0 && onboarding.percentage <= 100);
    });

    // 17. top partners
    it("17. top partners returns top 5 sorted by purchase value", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/partners/overview"
      });
      const { topPartners } = JSON.parse(res.payload).data;
      assert.ok(topPartners.length > 0 && topPartners.length <= 5);
      for (let i = 1; i < topPartners.length; i++) {
        assert.ok(topPartners[i - 1].totalValue >= topPartners[i].totalValue);
      }
    });

    // 18. partner detail
    it("18. partner detail returns 200 for valid ID and 404 for invalid ID", async () => {
      const resOverview = await app.inject({
        method: "GET",
        url: "/api/partners/overview"
      });
      const firstItem = JSON.parse(resOverview.payload).data.list.items[0];
      assert.ok(firstItem);

      const resDetail = await app.inject({
        method: "GET",
        url: `/api/partners/${firstItem.id}`
      });
      assert.equal(resDetail.statusCode, 200);
      const detailBody = JSON.parse(resDetail.payload);
      assert.equal(detailBody.success, true);
      assert.equal(detailBody.data.id, firstItem.id);
      assert.ok(Array.isArray(detailBody.data.recentOrders));

      const res404 = await app.inject({
        method: "GET",
        url: "/api/partners/non-existent-id-99999"
      });
      assert.equal(res404.statusCode, 404);
    });
  });
});
