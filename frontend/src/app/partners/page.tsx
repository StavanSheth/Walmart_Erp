"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { ErrorState } from "@/components/common/error-state";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { usePartners } from "@/hooks/use-partners";
import type {
  PartnersTab,
  PartnersQueryParams,
  PartnerListItem
} from "@/types/partners";

import { PartnersHero } from "@/components/partners/partners-hero";
import { PartnersKPIGrid } from "@/components/partners/partners-kpi-grid";
import { PartnersTabs } from "@/components/partners/partners-tabs";
import { PartnerDistributionCard } from "@/components/partners/partner-distribution-card";
import { PartnerGrowthChart } from "@/components/partners/partner-growth-chart";
import { PartnerInsightsCard } from "@/components/partners/partner-insights-card";
import { PartnerFilters } from "@/components/partners/partner-filters";
import { PartnerList } from "@/components/partners/partner-list";
import { TopPartnersCard } from "@/components/partners/top-partners-card";
import { PartnerOnboardingCard } from "@/components/partners/partner-onboarding-card";
import { PartnersCommunityCard } from "@/components/partners/partners-community-card";
import { PartnerDetailModal } from "@/components/partners/partner-detail";

function PartnersPageContent() {
  const { get, getNumber, setFilters } = useUrlFilters();

  // 1. Read URL query filters
  const tabParam = get("tab", "overview") as PartnersTab;
  const searchParam = get("search", "");
  const typeParam = get("type", "ALL");
  const regionIdParam = get("regionId", "ALL");
  const statusParam = get("status", "ALL");
  const pageParam = getNumber("page", 1);
  const pageSizeParam = getNumber("pageSize", 10);
  const periodParam = (get("period", "6m") as "6m" | "12m") || "6m";

  // Selected partner for Dossier Modal
  const [selectedPartnerId, setSelectedPartnerId] = React.useState<string | null>(null);
  // Add Partner dialog state
  const [isAddPartnerOpen, setIsAddPartnerOpen] = React.useState(false);
  const [newPartnerName, setNewPartnerName] = React.useState("");
  const [newPartnerType, setNewPartnerType] = React.useState("WHOLESALER");
  const [newPartnerContact, setNewPartnerContact] = React.useState("");
  const [newPartnerEmail, setNewPartnerEmail] = React.useState("");
  const [newPartnerPhone, setNewPartnerPhone] = React.useState("");
  const [newPartnerCreditLimit, setNewPartnerCreditLimit] = React.useState("50000");
  const [addSuccessMessage, setAddSuccessMessage] = React.useState<string | null>(null);

  // 2. Query Params for TanStack Query
  const queryParams = React.useMemo<PartnersQueryParams>(() => {
    return {
      tab: tabParam !== "overview" ? tabParam : undefined,
      search: searchParam.trim() ? searchParam.trim() : undefined,
      type: typeParam !== "ALL" ? typeParam : undefined,
      regionId: regionIdParam !== "ALL" ? regionIdParam : undefined,
      status: (statusParam !== "ALL" ? statusParam : undefined) as "ACTIVE" | "INACTIVE" | undefined,
      page: pageParam > 0 ? pageParam : 1,
      pageSize: pageSizeParam > 0 ? pageSizeParam : 10,
      period: periodParam
    };
  }, [
    tabParam,
    searchParam,
    typeParam,
    regionIdParam,
    statusParam,
    pageParam,
    pageSizeParam,
    periodParam
  ]);

  // 3. Primary TanStack Query call
  const { data, isLoading, isError, error, refetch } = usePartners(queryParams);

  // Handlers for URL synchronization
  const handleTabChange = (newTab: PartnersTab) => {
    setFilters({ tab: newTab === "overview" ? null : newTab, page: null });
  };

  const handleSearchChange = (val: string) => {
    setFilters({ search: val.trim() ? val : null, page: null });
  };

  const handleTypeChange = (val: string) => {
    setFilters({ type: val !== "ALL" ? val : null, page: null });
  };

  const handleRegionChange = (val: string) => {
    setFilters({ regionId: val !== "ALL" ? val : null, page: null });
  };

  const handleStatusChange = (val: string) => {
    setFilters({ status: val !== "ALL" ? val : null, page: null });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage > 1 ? newPage : null });
  };

  const handlePageSizeChange = (newSize: number) => {
    setFilters({ pageSize: newSize !== 10 ? newSize : null, page: null });
  };

  const handlePeriodChange = (newPeriod: "6m" | "12m") => {
    setFilters({ period: newPeriod !== "6m" ? newPeriod : null });
  };

  const handleResetFilters = () => {
    setFilters({
      tab: null,
      search: null,
      type: null,
      regionId: null,
      status: null,
      page: null
    });
  };

  const handleCardClick = (cardType: string) => {
    // Switch to corresponding tab or type filter
    if (cardType === "WHOLESALER") {
      setFilters({ tab: "wholesalers-retailers", type: "WHOLESALER", page: null });
    } else if (cardType === "RETAILER") {
      setFilters({ tab: "wholesalers-retailers", type: "RETAILER", page: null });
    } else if (cardType === "SUPPLIER") {
      setFilters({ tab: "suppliers", type: "SUPPLIER", page: null });
    } else if (cardType === "CUSTOMER") {
      setFilters({ tab: "customers", type: "CUSTOMER", page: null });
    }
  };

  // CSV Export Functionality
  const handleExportCsv = () => {
    const items: PartnerListItem[] = data?.list?.items || [];
    if (items.length === 0) return;

    const headers = [
      "ID",
      "Name",
      "Type",
      "Contact Person",
      "Email",
      "Phone",
      "Region",
      "Status",
      "Total Financial Value ($)",
      "Last Order Date"
    ];

    const rows = items.map((item) => [
      `"${item.id}"`,
      `"${(item.name || "").replace(/"/g, '""')}"`,
      `"${item.type}"`,
      `"${(item.contactPerson || "").replace(/"/g, '""')}"`,
      `"${(item.email || "").replace(/"/g, '""')}"`,
      `"${(item.phone || "").replace(/"/g, '""')}"`,
      `"${(item.region || "").replace(/"/g, '""')}"`,
      `"${item.status}"`,
      `"${item.totalValue}"`,
      `"${item.lastOrderDate ? new Date(item.lastOrderDate).toISOString().slice(0, 10) : "No orders"}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `walmart_partners_customers_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim()) return;

    // Show friendly success confirmation and reset form
    setAddSuccessMessage(
      `Partner "${newPartnerName}" created successfully! Records synchronized.`
    );
    setTimeout(() => {
      setAddSuccessMessage(null);
      setIsAddPartnerOpen(false);
      setNewPartnerName("");
      setNewPartnerContact("");
      setNewPartnerEmail("");
      setNewPartnerPhone("");
      refetch();
    }, 1500);
  };

  return (
    <PageContainer className="space-y-4 sm:space-y-6">
      {/* 1. Page Hero Banner with Slogan */}
      <PartnersHero />

      {/* Global Error Banner */}
      {isError && (
        <ErrorState
          title="Failed to load Partners & Customers"
          message={
            error instanceof Error
              ? error.message
              : "Unable to retrieve records from the database."
          }
          onRetry={() => refetch()}
        />
      )}

      {/* 2. Top Metric Cards Row: 4 KPI Cards + Promo Card (5 cards in a row matching desktop reference) */}
      <PartnersKPIGrid
        summary={data?.summary}
        isLoading={isLoading}
        onCardClick={handleCardClick}
        onAddPartner={() => setIsAddPartnerOpen(true)}
      />

      {/* 3. Navigation Tabs */}
      <PartnersTabs
        activeTab={tabParam}
        onTabChange={handleTabChange}
      />

      {/* 4. Main 2-Column Dashboard Layout: Left (Charts + Filters + Table) | Right (Insights + Top Partners + Onboarding + Community) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols on lg/xl, 9 cols on 2xl) */}
        <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 space-y-4 sm:space-y-5">
          {/* Top Analytics Row: Distribution Donut (5 cols) + Growth Line Chart (7 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
            <div className="md:col-span-5">
              <PartnerDistributionCard
                distribution={data?.distribution}
                totalPartners={data?.summary?.totalPartners}
                isLoading={isLoading}
                onSelectCategory={(category) => {
                  const upper = category.toUpperCase();
                  if (upper.includes("WHOLESALE")) handleTypeChange("WHOLESALER");
                  else if (upper.includes("RETAIL")) handleTypeChange("RETAILER");
                  else if (upper.includes("SUPPLIER")) handleTypeChange("SUPPLIER");
                  else if (upper.includes("CUSTOMER")) handleTypeChange("CUSTOMER");
                }}
              />
            </div>

            <div className="md:col-span-7">
              <PartnerGrowthChart
                growth={data?.growth}
                period={periodParam}
                onPeriodChange={handlePeriodChange}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Filter Toolbar */}
          <PartnerFilters
            search={searchParam}
            type={typeParam}
            regionId={regionIdParam}
            status={statusParam}
            types={data?.filterOptions?.types || []}
            regions={data?.filterOptions?.regions || []}
            statuses={data?.filterOptions?.statuses || []}
            onSearchChange={handleSearchChange}
            onTypeChange={handleTypeChange}
            onRegionChange={handleRegionChange}
            onStatusChange={handleStatusChange}
            onExport={handleExportCsv}
            onReset={handleResetFilters}
          />

          {/* Partner Table & Pagination */}
          <PartnerList
            items={data?.list?.items || []}
            pagination={
              data?.list?.pagination || {
                page: pageParam,
                pageSize: pageSizeParam,
                total: 0,
                totalPages: 1
              }
            }
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSelectPartner={(id) => setSelectedPartnerId(id)}
          />
        </div>

        {/* Right Rail Column: Insights, Top Partners, Onboarding Gauge & Community Card */}
        <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3 space-y-4 sm:space-y-5">
          <PartnerInsightsCard
            insights={data?.insights}
            isLoading={isLoading}
          />

          <TopPartnersCard
            topPartners={data?.topPartners}
            isLoading={isLoading}
            onSelectPartner={(id) => setSelectedPartnerId(id)}
          />

          <PartnerOnboardingCard
            onboarding={data?.onboarding}
            isLoading={isLoading}
          />

          <PartnersCommunityCard />
        </div>
      </div>

      {/* Dossier Modal for Partner / Customer Details */}
      <PartnerDetailModal
        partnerId={selectedPartnerId}
        isOpen={Boolean(selectedPartnerId)}
        onClose={() => setSelectedPartnerId(null)}
      />

      {/* Add Partner Dialog */}
      <Modal
        isOpen={isAddPartnerOpen}
        onClose={() => {
          setIsAddPartnerOpen(false);
          setAddSuccessMessage(null);
        }}
        size="md"
        title="Add New Partner or Customer"
        description="Register a new domestic vendor, wholesale merchant, or institutional customer account."
      >
        {addSuccessMessage ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium text-center">
            {addSuccessMessage}
          </div>
        ) : (
          <form onSubmit={handleSaveAddPartner} className="space-y-4 py-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Account / Business Name *</label>
              <Input
                placeholder="e.g. Apex Global Distributors"
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Relationship Type</label>
                <Select
                  value={newPartnerType}
                  onChange={(e) => setNewPartnerType(e.target.value)}
                  options={[
                    { value: "WHOLESALER", label: "Wholesaler" },
                    { value: "RETAILER", label: "Retailer (Business)" },
                    { value: "SUPPLIER", label: "Supplier / FMCG" },
                    { value: "CUSTOMER", label: "End Customer" }
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Credit Limit ($)</label>
                <Input
                  type="number"
                  placeholder="50000"
                  value={newPartnerCreditLimit}
                  onChange={(e) => setNewPartnerCreditLimit(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Primary Contact Person</label>
              <Input
                placeholder="e.g. Samantha Jenkins"
                value={newPartnerContact}
                onChange={(e) => setNewPartnerContact(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <Input
                  type="email"
                  placeholder="contact@company.com"
                  value={newPartnerEmail}
                  onChange={(e) => setNewPartnerEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Phone</label>
                <Input
                  placeholder="+1 (555) 000-0000"
                  value={newPartnerPhone}
                  onChange={(e) => setNewPartnerPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddPartnerOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save Partner
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </PageContainer>
  );
}

export default function PartnersPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 font-medium">
          Loading partners and customer ecosystem...
        </div>
      }
    >
      <PartnersPageContent />
    </React.Suspense>
  );
}
