"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_STORES } from "@/lib/config/stores";
import { useShell } from "@/context/shell-context";
import { StoreIcon, CheckIcon, PlusIcon } from "@/components/ui/icons";

export default function StoresPage() {
  const { currentStore, setCurrentStore } = useShell();

  return (
    <PageContainer
      title="Store Network"
      description="Retail store network, regional hierarchy, and active branch operations."
      actions={
        <Button size="sm">
          <PlusIcon className="w-3.5 h-3.5 mr-1" />
          Add Store
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Responsive Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DEMO_STORES.map((store) => {
            const isSelected = store.code === currentStore.code;
            return (
              <Card
                key={store.code}
                variant={isSelected ? "selected" : "default"}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-muted text-slate-700 tabular-nums">
                      {store.code}
                    </span>
                    {isSelected ? (
                      <Badge variant="spark">Active Outlet</Badge>
                    ) : (
                      <Badge variant="neutral">Supercenter</Badge>
                    )}
                  </div>
                  <CardTitle className="mt-2 truncate">
                    {store.name}
                  </CardTitle>
                  <CardDescription>
                    {store.city}, {store.state}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-2">
                  <div className="type-body-secondary space-y-1">
                    <p className="truncate text-slate-500">{store.address}</p>
                    <p className="font-mono tabular-nums text-slate-400">{store.phone}</p>
                  </div>

                  <Button
                    variant={isSelected ? "secondary" : "outline"}
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setCurrentStore(store)}
                  >
                    {isSelected ? (
                      <>
                        <CheckIcon className="w-3.5 h-3.5 mr-1 text-brand-primary" />
                        Selected Store
                      </>
                    ) : (
                      <>
                        <StoreIcon className="w-3.5 h-3.5 mr-1" />
                        Switch to Store
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-dashed border-border bg-surface-subtle">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Stores Module Scope
            </CardTitle>
            <CardDescription className="mt-1">
              Store configuration, employee assignments, POS registers, and region management will be implemented in future phases.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}
