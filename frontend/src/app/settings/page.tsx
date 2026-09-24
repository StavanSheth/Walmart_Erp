"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <PageContainer
      title="Settings"
      description="Enterprise organization parameters, tax rules, and local preferences."
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
                  Central enterprise identity used on all invoices, POs, and tax filings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Company Name" defaultValue="Walmart India Retail Pvt Ltd" readOnly />
                  <Input label="Tenant Code" defaultValue="WALMART-IN" readOnly className="font-mono tabular-nums" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Corporate PAN" defaultValue="AABCW1234D" readOnly className="font-mono tabular-nums" />
                  <Input label="Primary Currency" defaultValue="INR (₹)" readOnly />
                </div>
                <Input label="Default Timezone" defaultValue="Asia/Kolkata (IST)" readOnly />
              </CardContent>
              <CardFooter className="justify-between">
                <span className="type-body-secondary text-slate-400">Read-only demo configuration</span>
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
              Multi-tenant settings, custom role permissions, API keys, and notification channels will be implemented in future phases.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}
