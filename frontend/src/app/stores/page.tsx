"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/common/loading-state";
import { useShell } from "@/context/shell-context";
import { StoreIcon, CheckIcon, PlusIcon } from "@/components/ui/icons";
import { apiClient } from "@/lib/api/client";

interface StoreItem {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  email: string;
  status: string;
  region?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export default function StoresPage() {
  const { currentStore, setCurrentStore } = useShell();
  const [stores, setStores] = React.useState<StoreItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStores() {
      try {
        const res = await apiClient.get<StoreItem[]>("/api/stores");
        if (res.data) {
          setStores(res.data);
        }
      } catch (err) {
        console.error("Failed to load stores from database", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStores();
  }, []);

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
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-6 w-40 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-8 w-full rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stores.map((store) => {
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
                        <Badge variant="neutral">{store.region?.name || "Supercenter"}</Badge>
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
                      onClick={() =>
                        setCurrentStore({
                          id: store.id,
                          name: store.name,
                          code: store.code,
                          city: store.city,
                          state: store.state,
                          region: store.region?.name || "General",
                          address: store.address,
                          phone: store.phone
                        })
                      }
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
        )}

        <Card className="border-dashed border-border bg-surface-subtle">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Stores Module Operations
            </CardTitle>
            <CardDescription className="mt-1">
              Store configuration, POS registers, and region management are live and synchronized with the PostgreSQL database.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}
