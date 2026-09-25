"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { ErrorState } from "@/components/common/error-state";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { usePartners, useCreatePartner } from "@/hooks/use-partners";
import { usePartnerFilters } from "@/hooks/use-partner-filters";

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
  const {
    tab: tabParam,
    search: searchParam,
    type: typeParam,
    regionId: regionIdParam,
    status: statusParam,
    page: pageParam,
    pageSize: pageSizeParam,
    period: periodParam,
    queryParams,
    handleTabChange,
    handleSearchChange,
    handleTypeChange,
    handleRegionChange,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    handlePeriodChange,
    handleResetFilters,
    handleCardClick,
    handleExportCsv
  } = usePartnerFilters();

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
  const [addErrorMessage, setAddErrorMessage] = React.useState<string | null>(null);

  const createPartnerMutation = useCreatePartner();

  // Primary TanStack Query call
  const { data, isLoading, isError, error, refetch } = usePartners(queryParams);

  const handleSaveAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim()) {
      setAddErrorMessage("Partner name is required.");
      return;
    }

    setAddErrorMessage(null);
    try {
      await createPartnerMutation.mutateAsync({
        name: newPartnerName.trim(),
        type: newPartnerType as "SUPPLIER" | "WHOLESALER" | "DISTRIBUTOR" | "VENDOR",
        contactPerson: newPartnerContact.trim() || undefined,
        email: newPartnerEmail.trim() || undefined,
        phone: newPartnerPhone.trim() || undefined,
        creditLimit: parseFloat(newPartnerCreditLimit) || 0
      });

      // Show confirmation and reset form
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
        setNewPartnerCreditLimit("50000");
        refetch();
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create partner. Please check inputs.";
      setAddErrorMessage(msg);
      setAddSuccessMessage(null);
    }
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

      {/* All sections below the banner image: Pure canvas layout identical to Dashboard */}
      <div className="space-y-4 sm:space-y-5 pt-1 sm:pt-2">
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
        title="Add New Partner"
        description="Register a new domestic supplier, wholesaler, distributor, or vendor account."
      >
        {addSuccessMessage ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium text-center">
            {addSuccessMessage}
          </div>
        ) : (
          <form onSubmit={handleSaveAddPartner} className="space-y-4 py-1">
            {addErrorMessage && (
              <div className="p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                {addErrorMessage}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Partner / Organization Name *</label>
              <Input
                placeholder="e.g. Apex Global Distributors"
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Partner Type</label>
                <Select
                  value={newPartnerType}
                  onChange={(e) => setNewPartnerType(e.target.value)}
                  options={[
                    { value: "WHOLESALER", label: "Wholesaler" },
                    { value: "SUPPLIER", label: "Supplier / FMCG" },
                    { value: "DISTRIBUTOR", label: "Distributor" },
                    { value: "VENDOR", label: "Vendor" }
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Credit Limit (₹)</label>
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
                onClick={() => {
                  setIsAddPartnerOpen(false);
                  setAddErrorMessage(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={createPartnerMutation.isPending}>
                {createPartnerMutation.isPending ? "Saving..." : "Save Partner"}
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
