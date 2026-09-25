import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { prisma } from "../common/database/prisma.js";

export interface SearchResultItem {
  id: string;
  category: "Products" | "Stores" | "Customers" | "Partners" | "Orders";
  title: string;
  subtitle: string;
  badge?: string;
  href: string;
}

export const searchRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get<{ Querystring: { q?: string } }>("/", async (request, reply) => {
    const rawQuery = (request.query.q || "").trim();
    const results: SearchResultItem[] = [];

    if (!rawQuery) {
      // Default initial items when search is first opened
      const [products, stores, partners, customers, orders] = await Promise.all([
        prisma.product.findMany({ take: 3, include: { category: true } }),
        prisma.store.findMany({ take: 3 }),
        prisma.partner.findMany({ take: 2 }),
        prisma.customer.findMany({ take: 2 }),
        prisma.salesOrder.findMany({ take: 2, include: { customer: true } })
      ]);

      products.forEach((p) => {
        results.push({
          id: p.id,
          category: "Products",
          title: p.name,
          subtitle: `SKU: ${p.sku} • ${p.category?.name || "Catalog"} • $${Number(p.sellingPrice).toFixed(2)}`,
          badge: p.status === "ACTIVE" ? "In Stock" : p.status,
          href: "/inventory"
        });
      });

      stores.forEach((s) => {
        results.push({
          id: s.id,
          category: "Stores",
          title: s.name,
          subtitle: `${s.code} • ${s.address}, ${s.city}`,
          badge: s.status,
          href: "/stores"
        });
      });

      partners.forEach((pt) => {
        results.push({
          id: pt.id,
          category: "Partners",
          title: pt.name,
          subtitle: `Tax ID: ${pt.taxId || "N/A"} • ${pt.address || ""}`,
          badge: pt.type,
          href: "/partners"
        });
      });

      customers.forEach((c) => {
        results.push({
          id: c.id,
          category: "Customers",
          title: c.name,
          subtitle: `${c.email || ""} • ${c.phone || ""}`,
          badge: c.customerType,
          href: "/partners"
        });
      });

      orders.forEach((o) => {
        results.push({
          id: o.id,
          category: "Orders",
          title: o.orderNumber,
          subtitle: `Sales Order • $${Number(o.total).toLocaleString()} • ${o.customer?.name || "Retail"}`,
          badge: o.status,
          href: "/dashboard"
        });
      });

      return reply.status(200).send({
        success: true,
        data: results
      });
    }

    // Dynamic database search using ILIKE / contains mode insensitive
    const [products, stores, partners, customers, salesOrders, purchaseOrders] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: rawQuery, mode: "insensitive" } },
            { sku: { contains: rawQuery, mode: "insensitive" } },
            { barcode: { contains: rawQuery, mode: "insensitive" } }
          ]
        },
        take: 6,
        include: { category: true }
      }),
      prisma.store.findMany({
        where: {
          OR: [
            { name: { contains: rawQuery, mode: "insensitive" } },
            { city: { contains: rawQuery, mode: "insensitive" } },
            { code: { contains: rawQuery, mode: "insensitive" } }
          ]
        },
        take: 6
      }),
      prisma.partner.findMany({
        where: {
          OR: [
            { name: { contains: rawQuery, mode: "insensitive" } },
            { taxId: { contains: rawQuery, mode: "insensitive" } },
            { email: { contains: rawQuery, mode: "insensitive" } }
          ]
        },
        take: 6
      }),
      prisma.customer.findMany({
        where: {
          OR: [
            { name: { contains: rawQuery, mode: "insensitive" } },
            { phone: { contains: rawQuery, mode: "insensitive" } },
            { email: { contains: rawQuery, mode: "insensitive" } }
          ]
        },
        take: 6
      }),
      prisma.salesOrder.findMany({
        where: {
          orderNumber: { contains: rawQuery, mode: "insensitive" }
        },
        take: 6,
        include: { customer: true }
      }),
      prisma.purchaseOrder.findMany({
        where: {
          orderNumber: { contains: rawQuery, mode: "insensitive" }
        },
        take: 6,
        include: { partner: true }
      })
    ]);

    products.forEach((p) => {
      results.push({
        id: p.id,
        category: "Products",
        title: p.name,
        subtitle: `SKU: ${p.sku} • ${p.category?.name || "Catalog"} • $${Number(p.sellingPrice).toFixed(2)}`,
        badge: p.status === "ACTIVE" ? "Active" : p.status,
        href: "/inventory"
      });
    });

    stores.forEach((s) => {
      results.push({
        id: s.id,
        category: "Stores",
        title: s.name,
        subtitle: `${s.code} • ${s.address}, ${s.city}`,
        badge: s.status,
        href: "/stores"
      });
    });

    partners.forEach((pt) => {
      results.push({
        id: pt.id,
        category: "Partners",
        title: pt.name,
        subtitle: `Tax ID: ${pt.taxId || "N/A"} • ${pt.address || ""}`,
        badge: pt.type,
        href: "/partners"
      });
    });

    customers.forEach((c) => {
      results.push({
        id: c.id,
        category: "Customers",
        title: c.name,
        subtitle: `${c.email || ""} • ${c.phone || ""}`,
        badge: c.customerType,
        href: "/partners"
      });
    });

    salesOrders.forEach((o) => {
      results.push({
        id: o.id,
        category: "Orders",
        title: o.orderNumber,
        subtitle: `Sales Order • $${Number(o.total).toLocaleString()} • ${o.customer?.name || "Retail"}`,
        badge: o.status,
        href: "/dashboard"
      });
    });

    purchaseOrders.forEach((po) => {
      results.push({
        id: po.id,
        category: "Orders",
        title: po.orderNumber,
        subtitle: `Purchase Order • $${Number(po.total).toLocaleString()} • ${po.partner?.name || "Supplier"}`,
        badge: po.status,
        href: "/inventory"
      });
    });

    return reply.status(200).send({
      success: true,
      data: results
    });
  });
};
