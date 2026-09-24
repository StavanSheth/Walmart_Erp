"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { ResponsiveTable, type Column } from "@/components/common/responsive-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusIcon, FilterIcon } from "@/components/ui/icons";

interface DemoProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorderLevel: number;
  unitPrice: string;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

const DEMO_PRODUCTS: DemoProductItem[] = [
  {
    id: "prod-1",
    sku: "GRO-ATT-001",
    name: "Aashirvaad Shudh Chakki Atta 5kg",
    category: "Groceries & Staples",
    stock: 145,
    reorderLevel: 25,
    unitPrice: "₹280.00",
    status: "IN_STOCK"
  },
  {
    id: "prod-2",
    sku: "GRO-DAI-001",
    name: "Amul Pasteurised Butter 500g",
    category: "Dairy & Eggs",
    stock: 8,
    reorderLevel: 20,
    unitPrice: "₹275.00",
    status: "LOW_STOCK"
  },
  {
    id: "prod-3",
    sku: "BEV-TEA-001",
    name: "Tata Tea Premium 1kg",
    category: "Beverages",
    stock: 82,
    reorderLevel: 15,
    unitPrice: "₹490.00",
    status: "IN_STOCK"
  },
  {
    id: "prod-4",
    sku: "ELE-TV-001",
    name: "Samsung 55-inch 4K UHD Smart TV",
    category: "Electronics",
    stock: 14,
    reorderLevel: 5,
    unitPrice: "₹42,990.00",
    status: "IN_STOCK"
  },
  {
    id: "prod-5",
    sku: "APP-TSH-001",
    name: "Men Classic Solid Polo T-Shirt",
    category: "Apparel & Fashion",
    stock: 0,
    reorderLevel: 10,
    unitPrice: "₹599.00",
    status: "OUT_OF_STOCK"
  }
];

export default function InventoryPage() {
  const columns: Column<DemoProductItem>[] = [
    {
      key: "sku",
      header: "SKU / Code",
      render: (item) => <span className="font-mono text-xs font-semibold tabular-nums">{item.sku}</span>
    },
    {
      key: "name",
      header: "Product Name",
      render: (item) => (
        <div>
          <p className="font-medium text-slate-900 text-xs sm:text-sm">{item.name}</p>
          <p className="type-body-secondary">{item.category}</p>
        </div>
      )
    },
    {
      key: "unitPrice",
      header: "Unit Price",
      align: "right",
      isNumeric: true,
      render: (item) => <span className="font-semibold text-slate-900 tabular-nums">{item.unitPrice}</span>
    },
    {
      key: "stock",
      header: "Available Stock",
      align: "right",
      isNumeric: true,
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-900 tabular-nums">{item.stock}</span>
          <span className="text-[10px] text-slate-400 ml-1 tabular-nums">/ min {item.reorderLevel}</span>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (item) => <StatusBadge status={item.status} />
    }
  ];

  return (
    <PageContainer
      title="Inventory Management"
      description="Stock levels, product catalog, inventory replenishment, and movements."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FilterIcon className="w-3.5 h-3.5 mr-1" />
            Filter
          </Button>
          <Button size="sm">
            <PlusIcon className="w-3.5 h-3.5 mr-1" />
            Add SKU
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Standardized Responsive Table */}
        <ResponsiveTable
          data={DEMO_PRODUCTS}
          columns={columns}
          keyExtractor={(item) => item.id}
          mobileView="card"
          renderMobileCard={(item) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400 tabular-nums">{item.sku}</span>
                <StatusBadge status={item.status} />
              </div>
              <p className="font-semibold text-sm text-slate-900">{item.name}</p>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-border-subtle">
                <span>{item.category}</span>
                <span className="font-bold text-slate-900 tabular-nums">{item.unitPrice}</span>
              </div>
            </div>
          )}
        />

        <Card className="border-dashed border-border bg-surface-subtle">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Inventory Module Scope
            </CardTitle>
            <CardDescription className="mt-1">
              Inventory business logic, stock adjustments, purchase order receipts, and real-time replenishment will be implemented in future phases.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}
