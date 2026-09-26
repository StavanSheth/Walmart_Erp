import { Prisma } from "@prisma/client";
import { prisma } from "../common/database/prisma.js";
import { AppError } from "../common/errors/app-error.js";
import type {
  SettingsOverviewResponse,
  UpdateCompanyInput,
  UpdateRegionalInput,
  UpdateAppearanceInput,
  CompanyInformation,
  RegionalSettings,
  AppearancePreferences
} from "./settings.types.js";

// Cached memory store for custom application settings not stored directly on Organization schema
interface PersistedSettingsState {
  company: CompanyInformation;
  regional: RegionalSettings;
  appearance: AppearancePreferences;
}

const settingsStore: PersistedSettingsState = {
  company: {
    name: "Walmart India",
    code: "WM-IN-001",
    subtitle: "Enterprise Retail Operations — India",
    companyId: "WM-IN-001",
    headquarters: "Bengaluru, Karnataka, India",
    industry: "Retail & E-commerce",
    website: "www.walmart.co.in",
    logoUrl: "/brand/walmart-spark.svg"
  },
  regional: {
    defaultRegion: "India",
    timezone: "(UTC+05:30) Asia/Kolkata",
    currency: "USD - US Dollar ($)",
    dateFormat: "DD/MM/YYYY",
    language: "English (India)"
  },
  appearance: {
    theme: "light",
    primaryColor: "Walmart Blue",
    accentColor: "Walmart Yellow",
    density: "Comfortable",
    sidebar: "Expanded"
  }
};

let isInitialized = false;

export async function ensureSettingsCanonicalData() {
  if (isInitialized) return;

  try {
    const org = await prisma.organization.findFirst();
    if (!org) return;

    // 1. Ensure permissions exist
    const standardPermissions = [
      { code: "UPDATE_ORGANIZATION_SETTINGS", name: "Update Organization Settings", description: "Edit company details" },
      { code: "UPDATE_SYSTEM_SETTINGS", name: "Update System Settings", description: "Edit default regional & system settings" },
      { code: "MANAGE_USERS", name: "Manage Users", description: "Add, edit, or deactivate users" },
      { code: "MANAGE_ROLES", name: "Manage Roles", description: "Manage access control & roles" },
      { code: "MANAGE_INTEGRATIONS", name: "Manage Integrations", description: "Connect and manage external systems" },
      { code: "MANAGE_SECURITY", name: "Manage Security", description: "Manage auth, encryption, and compliance" }
    ];

    for (const p of standardPermissions) {
      await prisma.permission.upsert({
        where: { code: p.code },
        update: { name: p.name, description: p.description },
        create: { code: p.code, name: p.name, description: p.description }
      });
    }

    const allPerms = await prisma.permission.findMany();

    // 2. Ensure Admin role exists with all permissions
    const adminRole = await prisma.role.upsert({
      where: { name: "Admin" },
      update: { description: "Full system administrative access" },
      create: { name: "Admin", description: "Full system administrative access" }
    });

    for (const perm of allPerms) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: perm.id
          }
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: perm.id
        }
      });
    }

    // 3. Ensure Standard User role exists with no system update permissions
    await prisma.role.upsert({
      where: { name: "Standard User" },
      update: { description: "General operational user with restricted access" },
      create: { name: "Standard User", description: "General operational user with restricted access" }
    });

    // 4. Ensure Stavan Sheth exists as Admin
    await prisma.user.upsert({
      where: {
        organizationId_email: {
          organizationId: org.id,
          email: "stavan@walmart.com"
        }
      },
      update: {
        name: "Stavan Sheth",
        roleId: adminRole.id
      },
      create: {
        organizationId: org.id,
        roleId: adminRole.id,
        name: "Stavan Sheth",
        email: "stavan@walmart.com",
        passwordHash: "$2b$10$hashedAdminPassword123"
      }
    });

    // Update Organization details if needed
    await prisma.organization.update({
      where: { id: org.id },
      data: {
        name: settingsStore.company.name,
        currency: "INR",
        timezone: "America/New_York"
      }
    });

    isInitialized = true;
  } catch (err) {
    console.error("Failed to seed canonical settings data:", err);
  }
}

/**
 * Validates whether the user or simulated role has the required permission.
 * Throws a 403 Forbidden AppError and logs an ACCESS_DENIED audit entry if unauthorized.
 */
export async function verifyPermission(
  userId: string | undefined,
  requiredPermission: string,
  simulatedRole?: string
): Promise<boolean> {
  const org = await prisma.organization.findFirst();
  const orgId = org?.id || "org-walmart-demo";

  // If a simulated role is provided (for testing / role switching in UI)
  if (simulatedRole && simulatedRole.toLowerCase().includes("standard")) {
    await prisma.auditLog.create({
      data: {
        organizationId: orgId,
        userId: userId || null,
        action: "ACCESS_DENIED",
        entity: "SETTINGS",
        entityId: requiredPermission,
        oldValue: {
          attemptedPermission: requiredPermission,
          role: "Standard User",
          reason: "User lacks required administrative permission"
        },
        newValue: Prisma.JsonNull
      }
    });

    throw new AppError("You don't have access to change this setting.", 403, "FORBIDDEN");
  }

  // Look up user in database
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true }
              }
            }
          }
        }
      })
    : await prisma.user.findFirst({
        where: { email: "stavan@walmart.com" },
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true }
              }
            }
          }
        }
      });

  const userRole = user?.role?.name || "Standard User";
  const userPermissions = user?.role?.permissions.map((p) => p.permission.code) || [];

  const isAuthorized =
    userRole === "Admin" ||
    userRole === "System Administrator" ||
    userPermissions.includes(requiredPermission);

  if (!isAuthorized) {
    // Record immutable ACCESS_DENIED in AuditLog table
    await prisma.auditLog.create({
      data: {
        organizationId: orgId,
        userId: user?.id || null,
        action: "ACCESS_DENIED",
        entity: "SETTINGS",
        entityId: requiredPermission,
        oldValue: {
          attemptedPermission: requiredPermission,
          role: userRole,
          reason: "User lacks required administrative permission"
        },
        newValue: Prisma.JsonNull
      }
    });

    throw new AppError("You don't have access to change this setting.", 403, "FORBIDDEN");
  }

  return true;
}

export async function getSettingsOverview(
  userId?: string,
  simulatedRole?: string
): Promise<SettingsOverviewResponse> {
  await ensureSettingsCanonicalData();

  const [org, userCount, roleCount, activeUser, storeCount, auditCount] = await Promise.all([
    prisma.organization.findFirst(),
    prisma.user.count(),
    prisma.role.count(),
    userId
      ? prisma.user.findUnique({ where: { id: userId }, include: { role: true } })
      : prisma.user.findFirst({ where: { email: "stavan@walmart.com" }, include: { role: true } }),
    prisma.store.count(),
    prisma.auditLog.count()
  ]);

  const effectiveRole = simulatedRole || activeUser?.role?.name || "Admin";
  const isAdmin = effectiveRole === "Admin" || effectiveRole === "System Administrator";

  const permissions = isAdmin
    ? [
        "UPDATE_ORGANIZATION_SETTINGS",
        "UPDATE_SYSTEM_SETTINGS",
        "MANAGE_USERS",
        "MANAGE_ROLES",
        "MANAGE_INTEGRATIONS",
        "MANAGE_SECURITY"
      ]
    : [];

  return {
    company: {
      ...settingsStore.company,
      name: org?.name || settingsStore.company.name,
      code: org?.code || settingsStore.company.code
    },
    regional: settingsStore.regional,
    appearance: settingsStore.appearance,
    kpis: [
      {
        id: "kpi-users",
        title: "Users",
        value: String(Math.max(userCount, 248)),
        rawValue: Math.max(userCount, 248),
        subtitle: "Active Users",
        icon: "users"
      },
      {
        id: "kpi-roles",
        title: "Roles & Permissions",
        value: String(Math.max(roleCount, 12)),
        rawValue: Math.max(roleCount, 12),
        subtitle: "User Roles",
        icon: "shield"
      },
      {
        id: "kpi-integrations",
        title: "Integrations",
        value: "8",
        rawValue: 8,
        subtitle: "Connected Systems",
        icon: "nodes"
      },
      {
        id: "kpi-system-status",
        title: "System Status",
        value: "Healthy",
        subtitle: "All services operational",
        icon: "gear",
        statusColor: "emerald"
      }
    ],
    systemInfo: {
      version: "2.6.0",
      lastUpdated: "Sep 22, 2026",
      uptime: "99.98%"
    },
    systemStatus: {
      status: "Operational",
      title: "All Systems Operational",
      message: "Your Walmart ERP is running smoothly.",
      actionText: "View System Status →"
    },
    userManagement: {
      users: { title: "Users", description: "Add, edit or deactivate users", count: Math.max(userCount, 248) },
      roles: { title: "Roles & Permissions", description: "Manage access control", count: Math.max(roleCount, 12) },
      teams: { title: "Teams", description: "Organize users into teams", count: 18 },
      activityLogs: { title: "Activity Logs", description: "Track user activity", count: Math.max(auditCount, 1420) }
    },
    integrations: {
      pos: { title: "POS Systems", description: "Store POS integration", status: `Active (${storeCount || 7} Stores)` },
      ecommerce: { title: "E-commerce Platforms", description: "Marketplace & online store sync", status: "Connected" },
      shipping: { title: "Shipping & Logistics", description: "Carrier integrations (FedEx, UPS, etc.)", status: "Connected" },
      accounting: { title: "Accounting Systems", description: "ERP, tax and financial integrations", status: "Synced" },
      apiWebhooks: { title: "APIs & Webhooks", description: "Manage API keys and webhooks", status: "14 Endpoints" }
    },
    security: {
      authentication: { title: "Authentication", description: "Password, SSO, MFA", status: "Enforced" },
      dataSecurity: { title: "Data Security", description: "Encryption & data protection", status: "AES-256 Enabled" },
      compliance: { title: "Compliance", description: "SOC 2, GDPR, HIPAA", status: "Compliant" },
      auditLogs: { title: "Audit Logs", description: "Track system changes", status: "Recording" },
      backupRecovery: { title: "Backup & Recovery", description: "Manage backups and restore", status: "Daily (02:00 UTC)" }
    },
    currentUser: {
      id: activeUser?.id || "user-stavan-admin",
      name: activeUser?.name || "Stavan Sheth",
      role: effectiveRole,
      email: activeUser?.email || "stavan@walmart.com",
      avatarText: "SS",
      permissions
    }
  };
}

export async function updateCompanySettings(
  userId: string | undefined,
  input: UpdateCompanyInput,
  simulatedRole?: string
): Promise<CompanyInformation> {
  // Enforce critical permission check
  await verifyPermission(userId, "UPDATE_ORGANIZATION_SETTINGS", simulatedRole);

  const org = await prisma.organization.findFirst();
  const orgId = org?.id || "org-walmart-demo";
  const oldValue = { ...settingsStore.company };

  // Update store
  if (input.name) settingsStore.company.name = input.name;
  if (input.headquarters) settingsStore.company.headquarters = input.headquarters;
  if (input.industry) settingsStore.company.industry = input.industry;
  if (input.website) settingsStore.company.website = input.website;

  // Persist name in Organization table
  if (org && input.name) {
    await prisma.organization.update({
      where: { id: org.id },
      data: { name: input.name }
    });
  }

  // Create AuditLog entry
  await prisma.auditLog.create({
    data: {
      organizationId: orgId,
      userId: userId || null,
      action: "UPDATE_ORGANIZATION_SETTINGS",
      entity: "CompanyInformation",
      entityId: orgId,
      oldValue,
      newValue: { ...settingsStore.company }
    }
  });

  return settingsStore.company;
}

export async function updateRegionalSettings(
  userId: string | undefined,
  input: UpdateRegionalInput,
  simulatedRole?: string
): Promise<RegionalSettings> {
  // Enforce critical permission check
  await verifyPermission(userId, "UPDATE_SYSTEM_SETTINGS", simulatedRole);

  const org = await prisma.organization.findFirst();
  const orgId = org?.id || "org-walmart-demo";
  const oldValue = { ...settingsStore.regional };

  if (input.defaultRegion) settingsStore.regional.defaultRegion = input.defaultRegion;
  if (input.timezone) settingsStore.regional.timezone = input.timezone;
  if (input.currency) settingsStore.regional.currency = input.currency;
  if (input.dateFormat) settingsStore.regional.dateFormat = input.dateFormat;
  if (input.language) settingsStore.regional.language = input.language;

  // Persist currency / timezone in Organization table
  if (org) {
    await prisma.organization.update({
      where: { id: org.id },
      data: {
        currency: input.currency ? input.currency.slice(0, 3) : org.currency,
        timezone: input.timezone || org.timezone
      }
    });
  }

  // Create AuditLog entry
  await prisma.auditLog.create({
    data: {
      organizationId: orgId,
      userId: userId || null,
      action: "UPDATE_SYSTEM_SETTINGS",
      entity: "RegionalSettings",
      entityId: orgId,
      oldValue,
      newValue: { ...settingsStore.regional }
    }
  });

  return settingsStore.regional;
}

export async function updateAppearancePreferences(
  _userId: string | undefined,
  input: UpdateAppearanceInput
): Promise<AppearancePreferences> {
  // Personal user preferences are editable without requiring admin permissions
  if (input.theme) settingsStore.appearance.theme = input.theme;
  if (input.primaryColor) settingsStore.appearance.primaryColor = input.primaryColor;
  if (input.accentColor) settingsStore.appearance.accentColor = input.accentColor;
  if (input.density) settingsStore.appearance.density = input.density;
  if (input.sidebar) settingsStore.appearance.sidebar = input.sidebar;

  return settingsStore.appearance;
}

export async function getSettingsAuditLogs() {
  return await prisma.auditLog.findMany({
    where: {
      OR: [
        { entity: "SETTINGS" },
        { entity: "CompanyInformation" },
        { entity: "RegionalSettings" },
        { action: { in: ["UPDATE_ORGANIZATION_SETTINGS", "UPDATE_SYSTEM_SETTINGS", "ACCESS_DENIED"] } }
      ]
    },
    orderBy: { createdAt: "desc" },
    take: 15
  });
}
