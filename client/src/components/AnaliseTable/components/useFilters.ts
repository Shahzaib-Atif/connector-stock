import { useEffect, useState } from "react";
import { AnaliseTabFilters, defaultFilters } from "./constants";
import { STORAGE_KEYS } from "@/utils/constants";

export default function useFilters() {
  const FILTER_STORAGE_KEY = STORAGE_KEYS.ANALISE_TAB_FILTERS;

  const [filters, setFilters] = useState<AnaliseTabFilters>(() => {
    if (typeof window === "undefined") return defaultFilters;

    try {
      const stored = localStorage.getItem(FILTER_STORAGE_KEY);
      if (!stored) return defaultFilters;

      return {
        ...defaultFilters,
        ...(JSON.parse(stored) as AnaliseTabFilters),
      };
    } catch {
      return defaultFilters;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // ignore storage write failures
    }
  }, [filters]);

  const activeFiltersCount = Object.entries(filters).filter(([, value]) =>
    value.trim(),
  ).length;

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    filters,
    setFilters,
    activeFiltersCount,
    clearFilters,
  };
}
