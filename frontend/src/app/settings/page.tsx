"use client";

import * as React from "react";
import { PageContainer } from "@/components/common/page-container";
import { SettingsHero } from "@/components/settings/settings-hero";
import { SettingsKpiGrid } from "@/components/settings/settings-kpi-grid";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { GeneralSettingsGrid } from "@/components/settings/general-settings-grid";
import { SystemInfoStatus } from "@/components/settings/system-info-status";
import { AccessDeniedModal } from "@/components/settings/access-denied-modal";
import { EditCompanyModal } from "@/components/settings/edit-company-modal";
import { EditRegionalModal } from "@/components/settings/edit-regional-modal";
import {
  useSettingsOverview,
  useUpdateCompanySettings,
  useUpdateRegionalSettings,
  useUpdateAppearancePreferences,
  ApiError
} from "@/hooks/use-settings";
import type { SettingsTabId, CompanyInformation, RegionalSettings } from "@/types/settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTabId>("general");
  const [simulatedRole, setSimulatedRole] = React.useState("Admin");

  // Modals state
  const [isEditCompanyOpen, setIsEditCompanyOpen] = React.useState(false);
  const [isEditRegionalOpen, setIsEditRegionalOpen] = React.useState(false);
  const [accessDeniedState, setAccessDeniedState] = React.useState<{
    isOpen: boolean;
    message: string;
    settingName?: string;
  }>({
    isOpen: false,
    message: "You don't have access to change this setting."
  });

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Live queries & mutations
  const { data: overview, isLoading } = useSettingsOverview(simulatedRole);
  const updateCompanyMutation = useUpdateCompanySettings();
  const updateRegionalMutation = useUpdateRegionalSettings();
  const updateAppearanceMutation = useUpdateAppearancePreferences();

  const isAdmin = simulatedRole.toLowerCase().includes("admin");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handler for company update
  const handleUpdateCompany = async (payload: Partial<CompanyInformation>) => {
    try {
      await updateCompanyMutation.mutateAsync({ payload, simulatedRole });
      showToast("Company details updated successfully in database.");
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 403) {
        const errorData = err.data as { error?: { message?: string } } | undefined;
        const msg = errorData?.error?.message || "You don't have access to change this setting.";
        setAccessDeniedState({
          isOpen: true,
          message: msg,
          settingName: "Company Information"
        });
      } else {
        console.error("Failed to update company settings", err);
      }
    }
  };

  // Handler for regional update
  const handleUpdateRegional = async (payload: Partial<RegionalSettings>) => {
    try {
      await updateRegionalMutation.mutateAsync({ payload, simulatedRole });
      setIsEditRegionalOpen(false);
      showToast("Regional settings updated successfully in database.");
    } catch (err) {
      setIsEditRegionalOpen(false);
      if (err instanceof ApiError && err.statusCode === 403) {
        const errorData = err.data as { error?: { message?: string } } | undefined;
        const msg = errorData?.error?.message || "You don't have access to change this setting.";
        setAccessDeniedState({
          isOpen: true,
          message: msg,
          settingName: "Regional Settings"
        });
      } else {
        console.error("Failed to update regional settings", err);
      }
    }
  };

  // Direct trigger when restricted user clicks a protected setting
  const handleAttemptChangeRegional = (field: string) => {
    if (!isAdmin) {
      setAccessDeniedState({
        isOpen: true,
        message: "You don't have access to change this setting.",
        settingName: field
      });
    } else {
      setIsEditRegionalOpen(true);
    }
  };

  // Theme update (personal preference: Light or System)
  const handleChangeTheme = async (theme: "light" | "system") => {
    try {
      await updateAppearanceMutation.mutateAsync({ theme });
      showToast(`Theme updated to ${theme}.`);
    } catch (err) {
      console.error("Failed to update theme", err);
    }
  };

  return (
    <PageContainer>
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* UNIFIED RESPONSIVE SETTINGS LAYOUT (Mobile, Tablet, Desktop matching Dashboard) */}
      {/* ========================================================================= */}
      <div className="space-y-5 pb-20 md:pb-8">
        {/* 1. Hero Section (SETTINGS badge, heading, slogan & liquid glass controls) */}
        <SettingsHero
          currentRole={simulatedRole}
          onToggleRole={() => setSimulatedRole((r) => (r === "Admin" ? "Standard User" : "Admin"))}
        />

        {/* 2. KPI Cards: Positioned along horizon line of banner transition matching Dashboard & Reports */}
        <div className="pt-14 sm:pt-16 lg:pt-20 xl:pt-24">
          <SettingsKpiGrid
            kpis={overview?.kpis}
            onSelectKpi={(id) => {
              if (id === "kpi-users" || id === "kpi-roles") setActiveTab("users");
              else if (id === "kpi-integrations") setActiveTab("integrations");
              else if (id === "kpi-system-status") setActiveTab("system");
            }}
            isLoading={isLoading}
          />
        </div>

        {/* 3. Settings Tabs (~50px horizontal scroll on mobile/tablet) */}
        <SettingsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 4. Tab Content: General Tab -> Responsive Settings Grid (Mobile: 1 col, Tablet: 2 cols, Laptop: 3 cols) */}
        {activeTab === "general" && (
          <GeneralSettingsGrid
            overview={overview}
            canEditSystemSettings={isAdmin}
            onEditCompany={() => setIsEditCompanyOpen(true)}
            onAttemptChangeRegional={handleAttemptChangeRegional}
            onChangeTheme={handleChangeTheme}
            onSelectSubcategory={(category) => {
              if (category === "users") setActiveTab("users");
              else if (category === "integrations") setActiveTab("integrations");
              else if (category === "security") setActiveTab("security");
            }}
            isLoading={isLoading}
          />
        )}

        {/* Non-General Tab Previews */}
        {activeTab !== "general" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 capitalize">
                  {activeTab.replace("-", " ")} Management
                </h3>
                <p className="text-xs text-slate-500">
                  Granular configuration parameters and live policy enforcement
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-bold text-[#0071DC] bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
              >
                ← Back to General Overview
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 text-sm block">Sub-Module Configuration</span>
                <p className="text-slate-600 leading-relaxed">
                  All active policies for {activeTab} are currently operating under production baseline. Changes require administrative clearance.
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Status: Active & Synced
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 text-sm block">Audit & Governance</span>
                <p className="text-slate-600 leading-relaxed">
                  Every policy evaluation, user delegation, and integration handshake in this section is logged immutably in the PostgreSQL audit log ledger.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (!isAdmin) {
                      setAccessDeniedState({
                        isOpen: true,
                        message: "You don't have access to change this setting.",
                        settingName: `${activeTab} Configuration`
                      });
                    } else {
                      showToast(`Configured ${activeTab} parameters.`);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
                >
                  Configure {activeTab}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. Bottom System Information + System Status */}
        <SystemInfoStatus
          systemInfo={overview?.systemInfo}
          systemStatus={overview?.systemStatus}
          onViewStatus={() => setActiveTab("system")}
          isLoading={isLoading}
        />
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Access Denied Modal (Critical 403 Forbidden Access Control UX) */}
      <AccessDeniedModal
        isOpen={accessDeniedState.isOpen}
        onClose={() => setAccessDeniedState((prev) => ({ ...prev, isOpen: false }))}
        message={accessDeniedState.message}
        settingName={accessDeniedState.settingName}
      />

      {/* 2. Edit Company Details Modal */}
      <EditCompanyModal
        isOpen={isEditCompanyOpen}
        onClose={() => setIsEditCompanyOpen(false)}
        company={overview?.company}
        onSubmit={handleUpdateCompany}
        isSubmitting={updateCompanyMutation.isPending}
      />

      {/* 3. Edit Regional Settings Modal */}
      <EditRegionalModal
        isOpen={isEditRegionalOpen}
        onClose={() => setIsEditRegionalOpen(false)}
        regional={overview?.regional}
        onSubmit={handleUpdateRegional}
        isSubmitting={updateRegionalMutation.isPending}
      />
    </PageContainer>
  );
}
