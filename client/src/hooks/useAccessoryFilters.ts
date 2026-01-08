import { useState, useMemo, useCallback } from "react";
import { AccessoryApiResponse } from "@/utils/types/types";

export type AccessoryFilterColumn =
  | "all"
  | "id"
  | "type"
  | "refClient"
  | "connName";

interface AccessoryFilters {
  filterColumn: AccessoryFilterColumn;
  searchQuery: string;
}

interface AccessoryListItem extends AccessoryApiResponse {
  id: string;
}

interface UseAccessoryFiltersReturn {
  filters: AccessoryFilters;
  setFilterColumn: (column: AccessoryFilterColumn) => void;
  setSearchQuery: (query: string) => void;
  filteredAccessories: AccessoryListItem[];
  clearFilters: () => void;
}

// Helper to construct accessory ID (same as in accessoryService)
// function constructAccessoryId(accessory: AccessoryApiResponse): string {
//   return `${accessory.ConnName}_${accessory.AccessoryType}`;
// }

export function useAccessoryFilters(
  accessories: Record<string, AccessoryApiResponse>
): UseAccessoryFiltersReturn {
  const [filters, setFilters] = useState<AccessoryFilters>({
    filterColumn: "all",
    searchQuery: "",
  });

  const setFilterColumn = useCallback((column: AccessoryFilterColumn) => {
    setFilters((prev) => ({ ...prev, filterColumn: column }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ filterColumn: "all", searchQuery: "" });
  }, []);

  // Convert Record to array with id
  const accessoriesList = useMemo((): AccessoryListItem[] => {
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

function matchesAnyField(
  accessory: AccessoryListItem,
  normalizedQuery: string
) {
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
  accessory: AccessoryListItem,
  column: AccessoryFilterColumn
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
