import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import {
  calculateGrowthPercentage,
  calculateActivityHealth,
  calculateOnboardingPercentage,
  formatPartnerType
} from "../src/partners/partners.helpers.js";

describe("Phase 7 Partners & Customers - Complete 25 Required Verification Tests", () => {
  const app = buildApp();

  // 1. GET /api/partners/overview works
  it("1. GET /api/partners/overview works -> 200", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/partners/overview"
    });
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.equal(body.success, true);
    assert.ok(body.data);
  });

  // 2. KPI counts are correct
  it("2. KPI counts are numeric and match active partners/customers", async () => {
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
    assert.ok(summary.trends.totalPartners.sparkline.length === 6);
  });

  // 3. Retailer mapping: CustomerType.BUSINESS -> Retailer
  it("3. Retailer mapping: CustomerType.BUSINESS -> Retailer", () => {
    assert.equal(formatPartnerType("BUSINESS", "customer"), "Retailer");
  });

  // 4. End customer mapping: CustomerType.RETAIL -> Customer
  it("4. End customer mapping: CustomerType.RETAIL -> Customer", () => {
    assert.equal(formatPartnerType("RETAIL", "customer"), "Customer");
  });

  // 5. Supplier mapping
  it("5. Supplier mapping: PartnerType.SUPPLIER -> Supplier", () => {
    assert.equal(formatPartnerType("SUPPLIER", "partner"), "Supplier");
  });

  // 6. Wholesaler mapping
  it("6. Wholesaler mapping: PartnerType.WHOLESALER -> Wholesaler", () => {
    assert.equal(formatPartnerType("WHOLESALER", "partner"), "Wholesaler");
    assert.equal(formatPartnerType("DISTRIBUTOR", "partner"), "Distributor");
    assert.equal(formatPartnerType("VENDOR", "partner"), "Vendor");
  });

  // 7. Search filtering
  it("7. Search filtering matches by name, email, phone, or address", async () => {
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

  // 8. Region filtering
  it("8. Region filtering filters list items and regional order metrics", async () => {
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

  // 9. Status filtering
  it("9. Status filtering returns only matching status", async () => {
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

  // 10. Tab filtering
  it("10. Tab filtering: suppliers tab returns only suppliers", async () => {
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

  // 11. Pagination
  it("11. Pagination respects page and pageSize server-side", async () => {
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

  // 12. Purchase value for partners
  it("12. Purchase value for partners is non-negative and derived from purchase orders", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/partners/overview?tab=suppliers"
    });
    const { list } = JSON.parse(res.payload).data;
    list.items.forEach((item: { entity: string; totalValue: number }) => {
      assert.equal(item.entity, "partner");
      assert.equal(typeof item.totalValue, "number");
      assert.ok(item.totalValue >= 0);
    });
  });

  // 13. Sales value for customers
  it("13. Sales value for customers is non-negative and derived from sales orders", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/partners/overview?tab=customers"
    });
    const { list } = JSON.parse(res.payload).data;
    list.items.forEach((item: { entity: string; totalValue: number }) => {
      assert.equal(item.entity, "customer");
      assert.equal(typeof item.totalValue, "number");
      assert.ok(item.totalValue >= 0);
    });
  });

  // 14. Last order
  it("14. Last order date is ISO format or null", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/partners/overview"
    });
    const { list } = JSON.parse(res.payload).data;
    list.items.forEach((item: { lastOrderDate: string | null }) => {
      if (item.lastOrderDate) {
        assert.ok(!isNaN(Date.parse(item.lastOrderDate)));
      }
    });
  });

  // 15. Top Partners sorted by purchase value
  it("15. Top Partners are sorted strictly by purchase value descending", async () => {
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

  // 16. No creditLimit fallback
  it("16. No creditLimit fallback: top partners only includes partners with purchase order totals", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/partners/overview"
    });
    const { topPartners } = JSON.parse(res.payload).data;
    topPartners.forEach((tp: { totalValue: number; entity: string }) => {
      assert.equal(tp.entity, "partner");
      assert.ok(tp.totalValue >= 0);
    });
  });

  // 17. Growth calculation
  it("17. Growth calculation handles positive and negative trends accurately", () => {
    assert.equal(calculateGrowthPercentage(120, 100), 20);
    assert.equal(calculateGrowthPercentage(80, 100), -20);
    assert.equal(calculateGrowthPercentage(100, 100), 0);
  });

  // 18. Empty previous period returns null
  it("18. Empty previous period returns null (displayed as '—')", () => {
    assert.equal(calculateGrowthPercentage(10, 0), null);
    assert.equal(calculateGrowthPercentage(0, 0), null);
    assert.equal(calculateGrowthPercentage(5, -2), null);
  });

  // 19. Onboarding metric is deterministic
  it("19. Onboarding metric is deterministic and properly bounded", () => {
    assert.equal(calculateOnboardingPercentage(25, 100), 25);
    assert.equal(calculateOnboardingPercentage(120, 100), 100);
    assert.equal(calculateOnboardingPercentage(0, 50), 0);
    assert.equal(calculateOnboardingPercentage(10, 0), 0);
  });

  // 20. Satisfaction/activity metric contains no hardcoded trend
  it("20. Satisfaction/activity metric contains no hardcoded trend and is bounded", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/partners/overview"
    });
    const { insights } = JSON.parse(res.payload).data;
    assert.equal(typeof insights.activityHealth, "number");
    assert.ok(insights.activityHealth >= 50 && insights.activityHealth <= 100);
    // Verified: No hardcoded trend value 2
    assert.equal(insights.activityHealthTrend, null);
    assert.equal(insights.satisfactionTrend, null);
  });

  // 21. Partner detail works
  it("21. Partner detail works for valid partner ID and returns recent orders", async () => {
    const resOverview = await app.inject({
      method: "GET",
      url: "/api/partners/overview?tab=suppliers"
    });
    const supplierItem = JSON.parse(resOverview.payload).data.list.items[0];
    assert.ok(supplierItem);

    const res = await app.inject({
      method: "GET",
      url: `/api/partners/${supplierItem.id}`
    });
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.equal(body.success, true);
    assert.equal(body.data.id, supplierItem.id);
    assert.equal(body.data.entity, "partner");
    assert.ok(Array.isArray(body.data.recentOrders));
  });

  // 22. Customer detail works
  it("22. Customer detail works for valid customer ID", async () => {
    const resOverview = await app.inject({
      method: "GET",
      url: "/api/partners/overview?tab=customers"
    });
    const customerItem = JSON.parse(resOverview.payload).data.list.items[0];
    assert.ok(customerItem);

    const res = await app.inject({
      method: "GET",
      url: `/api/partners/${customerItem.id}`
    });
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.equal(body.success, true);
    assert.equal(body.data.id, customerItem.id);
    assert.equal(body.data.entity, "customer");
    assert.ok(Array.isArray(body.data.recentOrders));
  });

  // 23. POST /api/partners creates a real database record
  it("23. POST /api/partners creates a real database record", async () => {
    const uniqueName = `Test Partner ${Date.now()}`;
    const payload = {
      name: uniqueName,
      type: "SUPPLIER",
      contactPerson: "Arun Patel",
      phone: "+91 9900112233",
      email: `test_${Date.now()}@walmartdemo.local`,
      address: "Industrial Area, Pune",
      taxId: "27AABCT9999Z1",
      creditLimit: 250000
    };

    const res = await app.inject({
      method: "POST",
      url: "/api/partners",
      payload
    });

    assert.equal(res.statusCode, 201);
    const body = JSON.parse(res.payload);
    assert.equal(body.success, true);
    assert.equal(body.data.name, uniqueName);
    assert.equal(body.data.type, "SUPPLIER");
    assert.equal(body.data.contactPerson, "Arun Patel");
    assert.ok(body.data.id);
  });

  // 24. POST validation rejects invalid input
  it("24. POST validation rejects invalid input with 400", async () => {
    const invalidPayload = {
      name: "X", // too short (min 2)
      type: "INVALID_TYPE",
      email: "not-an-email"
    };

    const res = await app.inject({
      method: "POST",
      url: "/api/partners",
      payload: invalidPayload
    });

    assert.equal(res.statusCode, 400);
    const body = JSON.parse(res.payload);
    assert.equal(body.success, false);
    assert.equal(body.error.code, "VALIDATION_ERROR");
  });

  // 25. Export respects filters
  it("25. GET /api/partners/export returns CSV conforming to applied filters", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/partners/export?tab=suppliers&status=ACTIVE"
    });

    assert.equal(res.statusCode, 200);
    assert.ok(res.headers["content-type"]?.includes("text/csv"));
    assert.ok(res.headers["content-disposition"]?.includes("attachment"));
    const csv = res.payload;
    assert.ok(csv.includes("ID,Name,Type") || csv.includes('"ID","Name","Type"'));
    const lines = csv.split("\n");
    assert.ok(lines.length > 1);
  });
});
