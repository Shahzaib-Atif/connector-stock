import { FilterColumnTypes } from "@/components/common/FilterBar";
import { Accessory } from "@/utils/types";
import { useState, useMemo, useCallback } from "react";

interface AccessoryFilters {
  filterColumn: FilterColumnTypes;
  searchQuery: string;
}

interface UseAccessoryFiltersReturn {
  filters: AccessoryFilters;
  setFilterColumn: (column: FilterColumnTypes) => void;
  setSearchQuery: (query: string) => void;
  filteredAccessories: Accessory[];
  clearFilters: () => void;
}

export function useAccessoryFilters(
  accessories: Record<string, Accessory>,
): UseAccessoryFiltersReturn {
  const [filters, setFilters] = useState<AccessoryFilters>({
    filterColumn: "all",
    searchQuery: "",
  });

  const setFilterColumn = useCallback((column: FilterColumnTypes) => {
    setFilters((prev) => ({ ...prev, filterColumn: column }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ filterColumn: "all", searchQuery: "" });
  }, []);

  // Convert Record to array with id
  const accessoriesList = useMemo((): Accessory[] => {
    return Object.entries(accessories).map(([id, accessory]) => ({
      id,
      ...accessory,
    }));
  }, [accessories]);

  const filteredAccessories = useMemo(() => {
    const normalizedQuery = filters.searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return accessoriesList;
    }

    return accessoriesList.filter((accessory) => {
      if (filters.filterColumn === "all") {
        return matchesAnyField(accessory, normalizedQuery);
      } else {
        const columnValue = getColumnValue(accessory, filters.filterColumn);
        return columnValue.includes(normalizedQuery);
      }
    });
  }, [accessoriesList, filters]);

  return {
    filters,
    setFilterColumn,
    setSearchQuery,
    filteredAccessories,
    clearFilters,
  };
}

function matchesAnyField(accessory: Accessory, normalizedQuery: string) {
  return (
    accessory.id.toLowerCase().includes(normalizedQuery) ||
    accessory.ConnName?.toLowerCase().includes(normalizedQuery) ||
    accessory.AccessoryType?.toLowerCase().includes(normalizedQuery) ||
    accessory.RefClient?.toLowerCase().includes(normalizedQuery) ||
    accessory.RefDV?.toLowerCase().includes(normalizedQuery) ||
    accessory.CapotAngle?.toLowerCase().includes(normalizedQuery) ||
    accessory.ClipColor?.toLowerCase().includes(normalizedQuery)
  );
}

const getColumnValue = (
  accessory: Accessory,
  column: FilterColumnTypes,
): string => {
  switch (column) {
    case "id":
      return accessory.id?.toLowerCase() ?? "";
    case "type":
      return accessory.AccessoryType?.toLowerCase() ?? "";
    case "refClient":
      return accessory.RefClient?.toLowerCase() ?? "";
    case "connName":
      return accessory.ConnName?.toLowerCase() ?? "";
    default:
      return "";
  }
};
