export interface CompanyInformation {
  name: string;
  code: string;
  subtitle: string;
  companyId: string;
  headquarters: string;
  industry: string;
  website: string;
  logoUrl?: string;
}

export interface RegionalSettings {
  defaultRegion: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  language: string;
}

export interface AppearancePreferences {
  theme: "light" | "dark" | "system";
  primaryColor: string;
  accentColor: string;
  density: "Comfortable" | "Compact";
  sidebar: "Expanded" | "Collapsed";
}

export interface SettingsKpiItem {
  id: string;
  title: string;
  value: string;
  rawValue?: number;
  subtitle: string;
  icon: "users" | "shield" | "nodes" | "gear";
  statusColor?: string;
}

export interface SystemInformation {
  version: string;
  lastUpdated: string;
  uptime: string;
}

export interface SystemStatusData {
  status: "Operational" | "Degraded" | "Maintenance";
  title: string;
  message: string;
  actionText: string;
}

export interface UserManagementSummary {
  users: { title: string; description: string; count: number };
  roles: { title: string; description: string; count: number };
  teams: { title: string; description: string; count: number };
  activityLogs: { title: string; description: string; count: number };
}

export interface IntegrationsSummary {
  pos: { title: string; description: string; status: string };
  ecommerce: { title: string; description: string; status: string };
  shipping: { title: string; description: string; status: string };
  accounting: { title: string; description: string; status: string };
  apiWebhooks: { title: string; description: string; status: string };
}

export interface SecuritySummary {
  authentication: { title: string; description: string; status: string };
  dataSecurity: { title: string; description: string; status: string };
  compliance: { title: string; description: string; status: string };
  auditLogs: { title: string; description: string; status: string };
  backupRecovery: { title: string; description: string; status: string };
}

export interface CurrentUserProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarText: string;
  permissions: string[];
}

export interface SettingsOverviewResponse {
  company: CompanyInformation;
  regional: RegionalSettings;
  appearance: AppearancePreferences;
  kpis: SettingsKpiItem[];
  systemInfo: SystemInformation;
  systemStatus: SystemStatusData;
  userManagement: UserManagementSummary;
  integrations: IntegrationsSummary;
  security: SecuritySummary;
  currentUser: CurrentUserProfile;
}

export interface UpdateCompanyInput {
  name?: string;
  headquarters?: string;
  industry?: string;
  website?: string;
}

export interface UpdateRegionalInput {
  defaultRegion?: string;
  timezone?: string;
  currency?: string;
  dateFormat?: string;
  language?: string;
}

export interface UpdateAppearanceInput {
  theme?: "light" | "dark" | "system";
  primaryColor?: string;
  accentColor?: string;
  density?: "Comfortable" | "Compact";
  sidebar?: "Expanded" | "Collapsed";
}
