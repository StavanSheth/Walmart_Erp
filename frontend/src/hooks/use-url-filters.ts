"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export interface UrlFilterOptions {
  scroll?: boolean;
}

/**
 * Lightweight, reusable hook for managing URL search parameters and filter state
 */
export function useUrlFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = React.useCallback(
    (key: string, defaultValue = ""): string => {
      return searchParams.get(key) || defaultValue;
    },
    [searchParams]
  );

  const getNumber = React.useCallback(
    (key: string, defaultValue = 0): number => {
      const val = searchParams.get(key);
      if (!val) return defaultValue;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    },
    [searchParams]
  );

  const setFilters = React.useCallback(
    (
      updates: Record<string, string | number | null | undefined>,
      options: UrlFilterOptions = { scroll: false }
    ) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (
          val === null ||
          val === undefined ||
          val === "" ||
          val === "ALL" ||
          (key === "tab" && val === "all")
        ) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, String(val));
        }
      });

      const queryString = nextParams.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(nextUrl, { scroll: options.scroll ?? false });
    },
    [router, pathname, searchParams]
  );

  const setFilter = React.useCallback(
    (
      key: string,
      value: string | number | null | undefined,
      options?: UrlFilterOptions
    ) => {
      setFilters({ [key]: value }, options);
    },
    [setFilters]
  );

  const clearFilter = React.useCallback(
    (key: string, options?: UrlFilterOptions) => {
      setFilters({ [key]: null }, options);
    },
    [setFilters]
  );

  const clearAllFilters = React.useCallback(
    (options: UrlFilterOptions = { scroll: false }) => {
      router.replace(pathname, { scroll: options.scroll ?? false });
    },
    [router, pathname]
  );

  return {
    get,
    getNumber,
    setFilter,
    setFilters,
    clearFilter,
    clearAllFilters,
    searchParams,
    pathname
  };
}
