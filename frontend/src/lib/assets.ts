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
    background: "/images/banners/walmart-twilight-supercenter.png",
    banner: "/images/banners/walmart-twilight-supercenter.png",
    promo: "/images/banners/walmart-twilight-supercenter.png"
  },
  banners: {
    store: "/images/banners/store-banner.webp",
    twilight: "/images/banners/walmart-twilight-supercenter.png"
  },
  stores: {
    main: "/images/stores/store-main.webp",
    sidebar: "/images/stores/store-sidebar.webp"
  },
  navigation: {
    /* Reserved slot for user-supplied artwork per brand center rules (file currently optional/pending user supply) */
    mobileBottomRight: "/images/navigation/mobile-nav-bottom-right.webp"
  }
} as const;

export type AssetRegistry = typeof ASSETS;
