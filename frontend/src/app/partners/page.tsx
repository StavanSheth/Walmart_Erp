"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/common/loading-state";
import { apiClient } from "@/lib/api/client";

interface PartnerItem {
  id: string;
  name: string;
  type: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  taxId?: string | null;
  creditLimit: string | number;
  status: string;
}

interface CustomerItem {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  customerType: string;
  creditLimit: string | number;
  status: string;
}

export default function PartnersPage() {
  const [partners, setPartners] = React.useState<PartnerItem[]>([]);
  const [customers, setCustomers] = React.useState<CustomerItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [partnerSearch, setPartnerSearch] = React.useState("");
  const [customerSearch, setCustomerSearch] = React.useState("");

  React.useEffect(() => {
    async function loadPartners() {
      try {
        const res = await apiClient.get<{ partners: PartnerItem[]; customers: CustomerItem[] }>("/api/partners");
        if (res.data) {
          setPartners(res.data.partners || []);
          setCustomers(res.data.customers || []);
        }
      } catch (err) {
        console.error("Failed to load partners and customers from database", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPartners();
  }, []);

  const filteredPartners = React.useMemo(() => {
    const q = partnerSearch.toLowerCase().trim();
    if (!q) return partners;
    return partners.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.taxId && p.taxId.toLowerCase().includes(q)) ||
        (p.address && p.address.toLowerCase().includes(q)) ||
        p.type.toLowerCase().includes(q)
    );
  }, [partners, partnerSearch]);

  const filteredCustomers = React.useMemo(() => {
    const q = customerSearch.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q))
    );
  }, [customers, customerSearch]);

  return (
    <PageContainer
      title="Partners & Customers"
      description="Domestic wholesale suppliers, FMCG vendor relationships, and customer accounts synchronized live from PostgreSQL."
      actions={
        <Button size="sm">
          <PlusIcon className="w-3.5 h-3.5 mr-1" />
          Add Partner
        </Button>
      }
    >
      <div className="space-y-6">
        <Tabs defaultValue="partners">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="partners">
                Suppliers & Vendors ({isLoading ? "..." : partners.length})
              </TabsTrigger>
              <TabsTrigger value="customers">
                Customers ({isLoading ? "..." : customers.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Suppliers Tab */}
          <TabsContent value="partners" className="mt-4 space-y-4">
            <div className="max-w-md">
              <Input
                placeholder="Search suppliers by name, GSTIN, or city..."
                value={partnerSearch}
                onChange={(e) => setPartnerSearch(e.target.value)}
                startIcon={<SearchIcon className="w-4 h-4 text-slate-400" />}
              />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
                    <Skeleton className="h-5 w-24 rounded" />
                    <Skeleton className="h-6 w-44 rounded" />
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                  </div>
                ))}
              </div>
            ) : filteredPartners.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200/80">
                No suppliers matching "{partnerSearch}"
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPartners.map((p) => (
                  <Card key={p.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="neutral" className="text-[10px] font-mono">
                          {p.type}
                        </Badge>
                        <StatusBadge status={p.status} label={p.status === "ACTIVE" ? "Verified Partner" : p.status} />
                      </div>
                      <CardTitle className="mt-2 truncate">{p.name}</CardTitle>
                      <CardDescription>{p.address || "Domestic Partner"}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 type-body-secondary">
                      {p.taxId && (
                        <p className="font-mono tabular-nums text-slate-600 text-xs">
                          GSTIN: <span className="font-semibold">{p.taxId}</span>
                        </p>
                      )}
                      {p.email && (
                        <p className="font-mono text-slate-500 text-xs truncate">
                          {p.email}
                        </p>
                      )}
                      {p.phone && (
                        <p className="font-mono tabular-nums text-slate-400 text-xs">
                          {p.phone}
                        </p>
                      )}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Credit Limit:</span>
                        <span className="font-mono font-semibold text-slate-700">
                          ${Number(p.creditLimit).toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="mt-4 space-y-4">
            <div className="max-w-md">
              <Input
                placeholder="Search customers by name, phone, or email..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                startIcon={<SearchIcon className="w-4 h-4 text-slate-400" />}
              />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
                    <Skeleton className="h-5 w-20 rounded" />
                    <Skeleton className="h-6 w-36 rounded" />
                    <Skeleton className="h-4 w-48 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200/80">
                No customers matching "{customerSearch}"
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.map((c) => (
                  <Card key={c.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="truncate">{c.name}</CardTitle>
                        <Badge variant={c.customerType === "BUSINESS" ? "spark" : "neutral"} className="text-[10px]">
                          {c.customerType}
                        </Badge>
                      </div>
                      <CardDescription>{c.address || "Retail Customer"}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1.5 type-body-secondary">
                      {c.email && (
                        <p className="font-mono text-slate-600 text-xs truncate">{c.email}</p>
                      )}
                      {c.phone && (
                        <p className="font-mono tabular-nums text-slate-400 text-xs">{c.phone}</p>
                      )}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Credit Limit:</span>
                        <span className="font-mono font-semibold text-slate-700">
                          ${Number(c.creditLimit).toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Card className="border-dashed border-border bg-surface-subtle">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Partners & Customers Database Sync
            </CardTitle>
            <CardDescription className="mt-1">
              All supplier records, vendor relations, credit allowances, and customer directories are queried directly from the PostgreSQL production database.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}
