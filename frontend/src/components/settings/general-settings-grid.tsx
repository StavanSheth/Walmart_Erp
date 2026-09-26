"use client";

import * as React from "react";
import { CompanyInformationCard } from "./company-information-card";
import { RegionalSettingsCard } from "./regional-settings-card";
import { AppearancePreferencesCard } from "./appearance-preferences-card";
import { UserManagementCard } from "./user-management-card";
import { IntegrationsCard } from "./integrations-card";
import { SecurityComplianceCard } from "./security-compliance-card";
import type { SettingsOverviewResponse } from "@/types/settings";

interface GeneralSettingsGridProps {
  overview?: SettingsOverviewResponse;
  canEditSystemSettings?: boolean;
  onEditCompany?: () => void;
  onAttemptChangeRegional?: (field: string) => void;
  onChangeTheme?: (theme: "light" | "system") => void;
  onSelectSubcategory?: (category: string, id: string) => void;
  isLoading?: boolean;
}

export function GeneralSettingsGrid({
  overview,
  canEditSystemSettings = true,
  onEditCompany,
  onAttemptChangeRegional,
  onChangeTheme,
  onSelectSubcategory,
  isLoading
}: GeneralSettingsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4.5 items-stretch">
      {/* 1. Company Information */}
      <CompanyInformationCard
        company={overview?.company}
        onEdit={onEditCompany}
        isLoading={isLoading}
      />

      {/* 2. Regional Settings (Protected System Defaults) */}
      <RegionalSettingsCard
        regional={overview?.regional}
        canEdit={canEditSystemSettings}
        onAttemptChange={onAttemptChangeRegional}
        isLoading={isLoading}
      />

      {/* 3. Appearance & Preferences (Personal Preferences) */}
      <AppearancePreferencesCard
        appearance={overview?.appearance}
        onChangeTheme={onChangeTheme}
        isLoading={isLoading}
      />

      {/* 4. User Management */}
      <UserManagementCard
        summary={overview?.userManagement}
        onSelectSection={(id) => onSelectSubcategory?.("users", id)}
        isLoading={isLoading}
      />

      {/* 5. Integrations */}
      <IntegrationsCard
        summary={overview?.integrations}
        onSelectIntegration={(id) => onSelectSubcategory?.("integrations", id)}
        isLoading={isLoading}
      />

      {/* 6. Security & Compliance */}
      <SecurityComplianceCard
        summary={overview?.security}
        onSelectSection={(id) => onSelectSubcategory?.("security", id)}
        isLoading={isLoading}
      />
    </div>
  );
}
