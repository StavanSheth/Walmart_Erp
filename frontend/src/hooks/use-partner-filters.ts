"use client";

import * as React from "react";
import { useUrlFilters } from "@/hooks/use-url-filters";
import type { PartnersTab, PartnersQueryParams } from "@/types/partners";
import { apiClient } from "@/lib/api/client";

export function usePartnerFilters() {
  const { get, getNumber, setFilters } = useUrlFilters();

  const tab = get("tab", "overview") as PartnersTab;
  const search = get("search", "");
  const type = get("type", "ALL");
  const regionId = get("regionId", "ALL");
  const status = get("status", "ALL");
  const page = getNumber("page", 1);
  const pageSize = getNumber("pageSize", 10);
  const period = (get("period", "6m") as "6m" | "12m") || "6m";

  const [isExporting, setIsExporting] = React.useState(false);

  const queryParams = React.useMemo<PartnersQueryParams>(() => {
    return {
      tab: tab !== "overview" ? tab : undefined,
      search: search.trim() ? search.trim() : undefined,
      type: type !== "ALL" ? type : undefined,
      regionId: regionId !== "ALL" ? regionId : undefined,
      status: (status !== "ALL" ? status : undefined) as "ACTIVE" | "INACTIVE" | undefined,
      page: page > 0 ? page : 1,
      pageSize: pageSize > 0 ? pageSize : 10,
      period
    };
  }, [tab, search, type, regionId, status, page, pageSize, period]);

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

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const csvData = await apiClient.exportPartnersCsv(queryParams);
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `walmart_partners_customers_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error", err);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    tab,
    search,
    type,
    regionId,
    status,
    page,
    pageSize,
    period,
    queryParams,
    isExporting,
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
  };
}
