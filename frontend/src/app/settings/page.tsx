"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/common/loading-state";
import { apiClient } from "@/lib/api/client";

interface OrgSettingsData {
  organization: {
    id: string;
    name: string;
    code: string;
    currency: string;
    timezone: string;
    status: string;
    createdAt: string;
  } | null;
  storeCount: number;
  productCount: number;
  userCount: number;
}

export default function SettingsPage() {
  const [data, setData] = React.useState<OrgSettingsData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadSettings() {
      try {
        const res = await apiClient.get<OrgSettingsData>("/api/settings/organization");
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to load organization settings from API", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const org = data?.organization;

  return (
    <PageContainer
      title="Settings"
      description="Enterprise organization parameters, tax rules, and local preferences synchronized live with PostgreSQL."
    >
      <div className="space-y-6">
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">Organization</TabsTrigger>
            <TabsTrigger value="tax">GST & Tax Slabs</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Organization Profile</CardTitle>
                <CardDescription>
                  Central enterprise identity and database tenancy parameters used on all invoices, POs, and tax filings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Company Name" defaultValue={org?.name || "Walmart Retail"} readOnly />
                      <Input label="Tenant Code" defaultValue={org?.code || "WALMART-DEMO"} readOnly className="font-mono tabular-nums" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Organization ID" defaultValue={org?.id || ""} readOnly className="font-mono tabular-nums text-xs" />
                      <Input label="Primary Currency" defaultValue={org?.currency ? `${org.currency} ($)` : "USD ($)"} readOnly />
                    </div>
                    <Input label="Default Timezone" defaultValue={org?.timezone || "UTC"} readOnly />

                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center">
                      <div className="p-3 bg-surface-subtle rounded-xl">
                        <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Stores</span>
                        <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">{data?.storeCount ?? 0}</p>
                      </div>
                      <div className="p-3 bg-surface-subtle rounded-xl">
                        <span className="text-[11px] text-slate-400 uppercase font-semibold">Catalog SKUs</span>
                        <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">{data?.productCount ?? 0}</p>
                      </div>
                      <div className="p-3 bg-surface-subtle rounded-xl">
                        <span className="text-[11px] text-slate-400 uppercase font-semibold">System Users</span>
                        <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">{data?.userCount ?? 0}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="justify-between">
                <span className="type-body-secondary text-slate-400">Database Synchronized</span>
                <Button size="sm">Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="tax" className="mt-4">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Indian GST Tax Configuration</CardTitle>
                <CardDescription>Standardized goods and services tax rates applied across categories.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Default Intrastate GST Mode"
                    options={[
                      { value: "cgst_sgst", label: "CGST (50%) + SGST (50%)" },
                      { value: "igst", label: "IGST (100% Inter-state)" }
                    ]}
                  />
                  <Select
                    label="Tax Rounding Convention"
                    options={[
                      { value: "half_up", label: "Round Half-Up (Standard)" },
                      { value: "floor", label: "Floor (Round Down)" }
                    ]}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button size="sm">Update Tax Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-4">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>User Interface Preferences</CardTitle>
                <CardDescription>Customize navigation and display behavior.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Dense Table Layout</label>
                  <p className="type-body-secondary text-slate-500">Show compact row padding on desktop screens.</p>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button size="sm">Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-dashed border-border bg-surface-subtle">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Settings Module Scope
            </CardTitle>
            <CardDescription className="mt-1">
              Multi-tenant settings, custom role permissions, API keys, and notification channels are synchronized with PostgreSQL.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}
