"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";

export default function PartnersPage() {
  return (
    <PageContainer
      title="Partners & Customers"
      description="Domestic wholesale suppliers, FMCG vendor relationships, and customer accounts."
      actions={
        <Button size="sm">
          <PlusIcon className="w-3.5 h-3.5 mr-1" />
          Add Partner
        </Button>
      }
    >
      <div className="space-y-6">
        <Tabs defaultValue="partners">
          <TabsList>
            <TabsTrigger value="partners">Suppliers & Vendors (16)</TabsTrigger>
            <TabsTrigger value="customers">Retail Customers (60)</TabsTrigger>
          </TabsList>

          <TabsContent value="partners" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: "Tata Consumer Products Ltd",
                  code: "PART-TAT-001",
                  city: "Mumbai, Maharashtra",
                  gstin: "27AABCT1234F1Z5",
                  category: "Beverages & FMCG",
                  status: "ACTIVE"
                },
                {
                  name: "Amul India (GCMMF)",
                  code: "PART-AMU-001",
                  city: "Anand, Gujarat",
                  gstin: "24AAACG1234D1Z8",
                  category: "Dairy & Frozen",
                  status: "ACTIVE"
                },
                {
                  name: "Hindustan Unilever Ltd",
                  code: "PART-HUL-001",
                  city: "Mumbai, Maharashtra",
                  gstin: "27AABCH5678J1Z2",
                  category: "Personal Care & Home",
                  status: "ACTIVE"
                }
              ].map((p) => (
                <Card key={p.code}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-400">{p.code}</span>
                      <Badge variant="success">Verified Vendor</Badge>
                    </div>
                    <CardTitle className="text-sm font-semibold mt-1">{p.name}</CardTitle>
                    <CardDescription>{p.city}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-slate-600">
                    <p className="font-mono text-[11px] text-slate-500">GSTIN: {p.gstin}</p>
                    <p className="text-slate-400">Category: {p.category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="customers" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Rahul Sharma", email: "rahul.sharma@example.in", phone: "+91 98201 23456", city: "Mumbai" },
                { name: "Pooja Patel", email: "pooja.patel@example.in", phone: "+91 98112 34567", city: "New Delhi" },
                { name: "Vikram Reddy", email: "vikram.r@example.in", phone: "+91 98480 12345", city: "Bengaluru" }
              ].map((c, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">{c.name}</CardTitle>
                      <Badge variant="default">Retail</Badge>
                    </div>
                    <CardDescription>{c.city}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1 text-xs text-slate-500">
                    <p className="font-mono">{c.email}</p>
                    <p>{c.phone}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="border-dashed border-slate-300 bg-slate-50/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Partners & Customers Module Scope
            </CardTitle>
            <CardDescription className="mt-1">
              Vendor procurement contracts, credit limits, accounts payable, and customer loyalty profiles will be implemented in future phases.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}
