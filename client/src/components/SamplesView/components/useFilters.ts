import { useEffect, useState } from "react";
import { SampleFilters, defaultFilters } from "../constants";
import { STORAGE_KEYS } from "@/utils/constants";
import { getActiveFilterCount } from "../constants";

export default function useFilters() {
  const FILTER_STORAGE_KEY = STORAGE_KEYS.SAMPLES_FILTERS;

  const [filters, setFilters] = useState<SampleFilters>(() => {
    if (typeof window === "undefined") return defaultFilters;

    try {
      const stored = localStorage.getItem(FILTER_STORAGE_KEY);
      if (!stored) return defaultFilters;

      return {
        ...defaultFilters,
        ...(JSON.parse(stored) as SampleFilters),
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

  const setFilterField = (key: keyof SampleFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const activeFiltersCount = getActiveFilterCount(filters);

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    filters,
    setFilterField,
    activeFiltersCount,
    clearFilters,
  };
}
