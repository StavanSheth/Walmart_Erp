"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { ReportsHero } from "@/components/reports/reports-hero";
import { ReportCategoryCardsBar } from "@/components/reports/report-category-cards";
import { ReportFilterBar } from "@/components/reports/report-filter-bar";
import { SalesOverviewCard } from "@/components/reports/sales-overview-card";
import { SalesByCategoryCard } from "@/components/reports/sales-by-category-card";
import { QuickReportsPanel } from "@/components/reports/quick-reports-panel";
import { ScheduledReportsPanel } from "@/components/reports/scheduled-reports-panel";
import { GeneratedReportsTable } from "@/components/reports/generated-reports-table";
import { ReportsPromoBanner } from "@/components/reports/reports-promo-banner";
import { GenerateReportModal } from "@/components/reports/generate-report-modal";
import {
  useReportsOverview,
  useGenerateReport,
  useToggleScheduledReport
} from "@/hooks/use-reports";
import { apiClient } from "@/lib/api/client";
import type {
  ReportsQueryParams,
  GenerateReportInput,
  QuickReportItem,
  GeneratedReportRecord
} from "@/types/reports";

export default function ReportsPage() {
  // Filter state synchronized with backend API
  const [filters, setFilters] = React.useState<ReportsQueryParams>({
    reportType: "SALES",
    period: "30d",
    regionId: "ALL",
    storeId: "ALL",
    categoryId: "ALL",
    productId: "ALL",
    partnerType: "ALL",
    partnerId: "ALL",
    status: "ALL",
    search: "",
    page: 1,
    pageSize: 10
  });

  // Filter pop-in / pop-out toggle state
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  // Modal state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = React.useState(false);

  // React Query hooks
  const { data, isLoading, refetch, isFetching } = useReportsOverview(filters);
  const generateMutation = useGenerateReport();
  const toggleMutation = useToggleScheduledReport();

  // Active filter count for header pill
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (filters.reportType && filters.reportType !== "SALES") count++;
    if (filters.period && filters.period !== "30d") count++;
    if (filters.regionId && filters.regionId !== "ALL") count++;
    if (filters.storeId && filters.storeId !== "ALL") count++;
    if (filters.categoryId && filters.categoryId !== "ALL") count++;
    if (filters.productId && filters.productId !== "ALL") count++;
    if (filters.partnerType && filters.partnerType !== "ALL") count++;
    if (filters.partnerId && filters.partnerId !== "ALL") count++;
    if (filters.status && filters.status !== "ALL") count++;
    return count;
  }, [filters]);

  // Handlers
  const handleFilterChange = (key: keyof ReportsQueryParams, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "page" ? { page: 1 } : {}) // Reset to page 1 only when filters (not page) change
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      reportType: "SALES",
      period: "30d",
      regionId: "ALL",
      storeId: "ALL",
      categoryId: "ALL",
      productId: "ALL",
      partnerType: "ALL",
      partnerId: "ALL",
      status: "ALL",
      search: "",
      page: 1,
      pageSize: 10
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    handleFilterChange("reportType", categoryId);
  };

  const handleQuickReportSelect = (item: QuickReportItem) => {
    setFilters((prev) => ({
      ...prev,
      ...item.filters,
      page: 1
    }));
  };

  const handleToggleScheduled = (id: string, newEnabled: boolean) => {
    toggleMutation.mutate({ id, enabled: newEnabled });
  };

  const handleGenerateReportSubmit = (input: GenerateReportInput) => {
    generateMutation.mutate(input, {
      onSuccess: () => {
        setIsGenerateModalOpen(false);
      }
    });
  };

  // Download logic supporting CSV and JSON download
  const handleDownloadReports = async (selectedIds?: string[]) => {
    try {
      const reportId = selectedIds && selectedIds.length === 1 ? selectedIds[0] : undefined;
      const csvData = await apiClient.exportReportData(reportId, "CSV");

      // Trigger native browser download
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `walmart_erp_reports_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export report data:", err);
    }
  };

  const handleDownloadSingleReport = (report: GeneratedReportRecord) => {
    handleDownloadReports([report.id]);
  };

  return (
    <PageContainer>
      <div className="space-y-5 pb-20 md:pb-6">
        {/* 1. Hero Section (REPORTS badge, heading, slogan & liquid glass header controls) */}
        <ReportsHero
          isFiltersOpen={isFiltersOpen}
          onToggleFilters={() => setIsFiltersOpen((prev) => !prev)}
          onRefresh={() => refetch()}
          isFetching={isFetching}
          activeFiltersCount={activeFiltersCount}
        />

        {/* 2. 7 Report Category Cards (Sales, Inventory, Store, Partner, Financial, Operational, Custom) */}
        <div className="pt-36 sm:pt-40 lg:pt-48 xl:pt-56">
          <ReportCategoryCardsBar
            items={data?.categoryCards}
            selectedCategory={filters.reportType || "SALES"}
            onSelectCategory={handleCategorySelect}
            onBuildReportClick={() => setIsGenerateModalOpen(true)}
            isLoading={isLoading}
          />
        </div>

        {/* 3. Main 2-Column Grid (Left Column: Filters, Sales Analytics, Generated Reports Table; Right Column: Quick Reports, Scheduled Reports, Promo Banner) */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_295px] xl:grid-cols-[minmax(0,1fr)_300px] gap-4 sm:gap-4.5 items-start">
          {/* Main Left Column (~930–950px usable width) */}
          <div className="space-y-4 sm:space-y-4.5 min-w-0">
            {/* Pop-in / Pop-out Report Filters Panel (positioned cleanly at top of main column) */}
            <ReportFilterBar
              filters={filters}
              filterOptions={data?.filterOptions}
              onChangeFilter={handleFilterChange}
              onResetFilters={handleResetFilters}
              onGenerateReportClick={() => setIsGenerateModalOpen(true)}
              isOpen={isFiltersOpen}
              onToggleOpen={() => setIsFiltersOpen((prev) => !prev)}
            />

            {/* Sales Overview (68%) + Sales by Category (32%) */}
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,67%)_minmax(0,33%)] xl:grid-cols-[minmax(0,68%)_minmax(0,32%)] gap-4 sm:gap-4.5 items-stretch">
              {/* Sales Overview Report with 5 KPIs and Multi-line Area Chart */}
              <SalesOverviewCard
                kpis={data?.kpis}
                salesTrend={data?.salesTrend}
                period={filters.period || "30d"}
                onPeriodChange={(p) => handleFilterChange("period", p)}
                isLoading={isLoading}
              />

              {/* Sales by Category Donut Chart */}
              <SalesByCategoryCard
                items={data?.categoryDistribution?.items}
                totalSalesFormatted={data?.categoryDistribution?.formattedTotalSales}
                isLoading={isLoading}
              />
            </div>

            {/* Generated Reports Table (Full width of the left column) */}
            <GeneratedReportsTable
              reports={data?.generatedReports?.items}
              totalReports={data?.generatedReports?.total}
              page={filters.page || 1}
              pageSize={filters.pageSize || 10}
              totalPages={data?.generatedReports?.totalPages || 1}
              onPageChange={handlePageChange}
              onSearchChange={(q) => handleFilterChange("search", q)}
              onDownloadReports={handleDownloadReports}
              onDownloadSingleReport={handleDownloadSingleReport}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column (~295–300px fixed width, continuously stacked) */}
          <div className="space-y-4 sm:space-y-4.5 shrink-0">
            {/* Quick Reports Panel */}
            <QuickReportsPanel
              items={data?.quickReports}
              onSelectQuickReport={handleQuickReportSelect}
              isLoading={isLoading}
            />

            {/* Scheduled Reports Panel */}
            <ScheduledReportsPanel
              items={data?.scheduledReports}
              onToggleReport={handleToggleScheduled}
              isLoading={isLoading}
              compact
            />

            {/* Promotional Banner: "From Data to a Brighter Tomorrow" */}
            <ReportsPromoBanner />
          </div>
        </div>
      </div>

      {/* Generate Report Modal Dialog */}
      <GenerateReportModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onSubmit={handleGenerateReportSubmit}
        isSubmitting={generateMutation.isPending}
      />
    </PageContainer>
  );
}
