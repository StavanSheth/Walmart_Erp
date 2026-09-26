import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
const D = (v: string | number) => new Prisma.Decimal(String(v));

async function main() {
  console.log("Rescaling 30-day sales and purchases to fit 0 to 50K dynamically...");

  const now = new Date("2026-09-27T12:00:00+05:30");
  const thirtyDaysAgo = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);

  // 1. Rescale Sales Orders in the last 31 days
  const salesOrders = await prisma.salesOrder.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo }
    },
    orderBy: { createdAt: "asc" }
  });

  console.log(`Found ${salesOrders.length} sales orders in the past 30 days`);

  const ordersByDate = new Map<string, typeof salesOrders>();
  for (const so of salesOrders) {
    const k = so.createdAt.toISOString().slice(0, 10);
    if (!ordersByDate.has(k)) ordersByDate.set(k, []);
    ordersByDate.get(k)!.push(so);
  }

  const dates = Array.from(ordersByDate.keys()).sort();
  for (let di = 0; di < dates.length; di++) {
    const dateStr = dates[di];
    const dayOrders = ordersByDate.get(dateStr)!;
    const dayOfWeek = new Date(dateStr).getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.2 : 1.0;
    // Sinusoidal wave between $24,000 and $44,000
    const targetDayTotal = Math.round((28000 + Math.sin(di * 0.7) * 9000) * weekendMultiplier);

    const currentDayTotal = dayOrders.reduce((acc, o) => acc + Number(o.total), 0);
    const scale = currentDayTotal > 0 ? targetDayTotal / currentDayTotal : 3.5;

    for (const order of dayOrders) {
      const newTotal = Math.round(Number(order.total) * scale * 100) / 100;
      const newSubtotal = Math.round(Number(order.subtotal) * scale * 100) / 100;
      const newTax = Math.round((newTotal - newSubtotal) * 100) / 100;

      await prisma.salesOrder.update({
        where: { id: order.id },
        data: {
          total: D(newTotal),
          subtotal: D(newSubtotal),
          tax: D(newTax)
        }
      });

      await prisma.payment.updateMany({
        where: { salesOrderId: order.id },
        data: { amount: D(newTotal) }
      });
    }
  }
  console.log("✅ Sales orders successfully rescaled between $24K and $44K per day!");

  // 2. Rescale Purchases in the last 31 days
  const purchaseOrders = await prisma.purchaseOrder.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo }
    },
    orderBy: { createdAt: "asc" }
  });

  console.log(`Found ${purchaseOrders.length} purchase orders in the past 30 days`);

  const posByDate = new Map<string, typeof purchaseOrders>();
  for (const po of purchaseOrders) {
    const k = po.createdAt.toISOString().slice(0, 10);
    if (!posByDate.has(k)) posByDate.set(k, []);
    posByDate.get(k)!.push(po);
  }

  const store = await prisma.store.findFirst();
  const partner = await prisma.partner.findFirst();

  for (let di = 0; di < dates.length; di++) {
    const dateStr = dates[di];
    const dayPOs = posByDate.get(dateStr) || [];
    // Purchases between $12,000 and $34,000
    const targetPurchases = Math.round(20000 + Math.cos(di * 0.6) * 8000);

    if (dayPOs.length > 0) {
      const currentPoTotal = dayPOs.reduce((acc, po) => acc + Number(po.total), 0);
      const poScale = targetPurchases / Math.max(1, currentPoTotal);

      for (const po of dayPOs) {
        const newPoTotal = Math.round(Number(po.total) * poScale * 100) / 100;
        const newPoSubtotal = Math.round(newPoTotal / 1.08 * 100) / 100;
        const newPoTax = Math.round((newPoTotal - newPoSubtotal) * 100) / 100;

        await prisma.purchaseOrder.update({
          where: { id: po.id },
          data: {
            total: D(newPoTotal),
            subtotal: D(newPoSubtotal),
            tax: D(newPoTax)
          }
        });
      }
    } else if (store && partner) {
      const d = new Date(dateStr);
      d.setHours(11, 30, 0, 0);
      const poTot = Math.round((16000 + (di * 137) % 8000) * 100) / 100;
      const poSub = Math.round((poTot / 1.08) * 100) / 100;
      const poTax = Math.round((poTot - poSub) * 100) / 100;

      await prisma.purchaseOrder.create({
        data: {
          id: `po-replenish-${di}`,
          organizationId: store.organizationId,
          storeId: store.id,
          partnerId: partner.id,
          orderNumber: `PO-R-${1000 + di}`,
          status: "RECEIVED",
          subtotal: D(poSub),
          tax: D(poTax),
          total: D(poTot),
          createdAt: d,
          updatedAt: d
        }
      });
    }
  }
  console.log("✅ Purchase orders smoothed and scaled between $12K and $34K per day!");

  console.log("ALL DATA RESCALED SUCCESSFULLY!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
