import type { NotificationItem, SearchResultItem } from "@/types/store";

/**
 * @deprecated All notifications and search results are now fetched dynamically from PostgreSQL (/api/notifications, /api/search).
 * Static demo data is no longer utilized in the frontend.
 */
export const DEMO_NOTIFICATIONS: NotificationItem[] = [];
export const DEMO_SEARCH_DATA: SearchResultItem[] = [];
