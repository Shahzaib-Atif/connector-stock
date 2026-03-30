import { AccessoryExtended, AccessoryMap } from "@/utils/types";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  AccessoryFilters,
  defaultFilters,
  STORAGE_KEY,
} from "@/components/AccessoriesListView/constants";

interface UseAccessoryFiltersReturn {
  filters: AccessoryFilters;
  setFilterField: (key: keyof AccessoryFilters, value: string) => void;
  filteredAccessories: AccessoryExtended[];
  clearFilters: () => void;
  typeOptions: string[];
  colorOptions: string[];
}

export function useAccessoryFilters(
  accessories: AccessoryMap,
): UseAccessoryFiltersReturn {
  const [filters, setFilters] = useState<AccessoryFilters>(() => {
    if (typeof window === "undefined") return defaultFilters;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return defaultFilters;
      return { ...defaultFilters, ...JSON.parse(stored) };
    } catch {
      return defaultFilters;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
      /* empty */
    }
  }, [filters]);

  const setFilterField = useCallback(
    (key: keyof AccessoryFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const accessoriesList = useMemo((): AccessoryExtended[] => {
    return Object.entries(accessories).map(([id, accessory]) => ({
      ...accessory,
      id,
    }));
  }, [accessories]);

  const typeOptions = useMemo(
    () => getUniqueOptions(accessoriesList.map((a) => a.AccessoryType)),
    [accessoriesList],
  );

  const colorOptions = useMemo(
    () => getUniqueOptions(accessoriesList.map((a) => a.ClipColor)),
    [accessoriesList],
  );

  const filteredAccessories = useMemo(() => {
    const idQuery = filters.idQuery.trim().toLowerCase();
    const connNameQuery = filters.connName.trim().toLowerCase();
    const refClientQuery = filters.refClient.trim().toLowerCase();
    const refDVQuery = filters.refDV.trim().toLowerCase();

    return accessoriesList.filter((accessory) => {
      const matchesId =
        !idQuery || accessory.customId.toLowerCase().includes(idQuery);
      const matchesType =
        filters.type === "all" || accessory.AccessoryType === filters.type;
      const matchesConn =
        !connNameQuery ||
        accessory.ConnName?.toLowerCase().includes(connNameQuery);
      const matchesRefClient =
        !refClientQuery ||
        accessory.RefClient?.toLowerCase().includes(refClientQuery);
      const matchesRefDV =
        !refDVQuery || accessory.RefDV?.toLowerCase().includes(refDVQuery);
      const matchesColor =
        filters.clipColor === "all" ||
        accessory.ClipColor === filters.clipColor;

      return (
        matchesId &&
        matchesType &&
        matchesConn &&
        matchesRefClient &&
        matchesRefDV &&
        matchesColor
      );
    });
  }, [accessoriesList, filters]);

  return {
    filters,
    setFilterField,
    filteredAccessories,
    clearFilters,
    typeOptions,
    colorOptions,
  };
}

function getUniqueOptions(values: Array<string | undefined | null>): string[] {
  const unique = Array.from(new Set(values.filter((v) => !!v) as string[]));
  return unique.sort((a, b) => a.localeCompare(b));
}
