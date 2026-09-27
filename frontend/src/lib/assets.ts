/**
 * Walmart ERP — Centralized Asset Registry
 * Single source of truth for all brand marks, hero banners, store imagery, and navigation assets.
 * Eliminates scattered hardcoded image paths across components and screens.
 */

export const ASSETS = {
  brand: {
    spark: "/brand/walmart-spark.svg",
    sparkLogo: "/brand/logo/walmart-spark.svg",
    sparkWhite: "/brand/logo/walmart-spark-white.svg"
  },
  dashboard: {
    background: "/images/banners/walmart-supercenter-twilight.webp",
    banner: "/images/banners/walmart-supercenter-twilight.webp",
    promo: "/images/banners/walmart-supercenter-twilight.webp"
  },
  banners: {
    store: "/images/banners/store-banner.webp",
    twilight: "/images/banners/walmart-supercenter-twilight.webp",
    associates: "/images/banners/walmart-associates-promo.webp"
  },
  stores: {
    main: "/images/stores/store-main.webp",
    sidebar: "/images/stores/store-sidebar.webp"
  },
  navigation: {
    mobileBottomRight: "/images/navigation/mobile-nav-bottom-right.webp"
  }
} as const;

export type AssetRegistry = typeof ASSETS;
