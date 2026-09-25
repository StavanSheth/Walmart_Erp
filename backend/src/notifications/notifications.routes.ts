import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { prisma } from "../common/database/prisma.js";

export interface NotificationItem {
  id: string;
  type: "stock" | "order" | "payment" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  link: string;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export const notificationsRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/", async (_request, reply) => {
    const notifications: NotificationItem[] = [];

    const [lowStockInv, recentPos, recentPayments, recentAudits] = await Promise.all([
      prisma.inventory.findMany({
        where: {
          onHand: {
            lte: 20
          }
        },
        take: 3,
        include: {
          product: true,
          store: true
        }
      }),
      prisma.purchaseOrder.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        include: { partner: true }
      }),
      prisma.payment.findMany({
        take: 2,
        orderBy: { createdAt: "desc" }
      }),
      prisma.auditLog.findMany({
        take: 2,
        orderBy: { createdAt: "desc" }
      })
    ]);

    // 1. Live stock notifications from inventory table
    lowStockInv.forEach((inv) => {
      const isZero = inv.onHand === 0;
      notifications.push({
        id: `notif-stock-${inv.id}`,
        type: "stock",
        title: isZero ? "Stockout Alert" : "Low Stock Warning",
        message: `${inv.product.name} is at ${inv.onHand} units (reorder level: ${inv.product.reorderLevel}) at ${inv.store.name}.`,
        timestamp: timeAgo(inv.updatedAt),
        read: false,
        priority: isZero ? "high" : "medium",
        link: "/inventory"
      });
    });

    // 2. Live procurement orders from purchase orders table
    recentPos.forEach((po) => {
      notifications.push({
        id: `notif-po-${po.id}`,
        type: "order",
        title: `PO ${po.orderNumber} (${po.status})`,
        message: `Order for $${Number(po.total).toLocaleString()} with ${po.partner?.name || "Supplier"} placed.`,
        timestamp: timeAgo(po.createdAt),
        read: po.status === "RECEIVED",
        priority: "medium",
        link: "/inventory"
      });
    });

    // 3. Live payment notifications
    recentPayments.forEach((pay) => {
      notifications.push({
        id: `notif-pay-${pay.id}`,
        type: "payment",
        title: "Payment Reconciliation",
        message: `$${Number(pay.amount).toLocaleString()} payment via ${pay.method} marked ${pay.status}.`,
        timestamp: timeAgo(pay.createdAt),
        read: true,
        priority: "low",
        link: "/ledger"
      });
    });

    // 4. Live audit events
    recentAudits.forEach((audit) => {
      notifications.push({
        id: `notif-audit-${audit.id}`,
        type: "system",
        title: audit.action.replace(/_/g, " "),
        message: `System record updated for ${audit.entity} (${audit.entityId}).`,
        timestamp: timeAgo(audit.createdAt),
        read: true,
        priority: "low",
        link: "/dashboard"
      });
    });

    return reply.status(200).send({
      success: true,
      data: notifications
    });
  });
};
