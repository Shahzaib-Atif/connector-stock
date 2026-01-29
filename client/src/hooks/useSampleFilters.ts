import { useState, useMemo, useCallback } from "react";
import { Sample } from "@/utils/types";
import { FilterColumnTypes } from "@/components/common/FilterBar";

interface SampleFilters {
  filterColumn: FilterColumnTypes;
  searchQuery: string;
}

interface useSampleFiltersReturn {
  filters: SampleFilters;
  setFilterColumn: (column: FilterColumnTypes) => void;
  setSearchQuery: (query: string) => void;
  filteredSamples: Sample[];
  clearFilters: () => void;
}

export function useSampleFilters(samples: Sample[]): useSampleFiltersReturn {
  const [filters, setFilters] = useState<SampleFilters>({
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

  const filteredSamples = useMemo(() => {
    const normalizedQuery = filters.searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return samples;
    }

    return samples.filter((sample) => {
      if (filters.filterColumn === "all") {
        return matchesAnyField(sample, normalizedQuery); // Search across all columns
      } else {
        // Search only in selected column
        const columnValue = getColumnValue(sample, filters.filterColumn);
        return columnValue.includes(normalizedQuery);
      }
    });
  }, [samples, filters]);

  return {
    filters,
    setFilterColumn,
    setSearchQuery,
    filteredSamples,
    clearFilters,
  };
}

function matchesAnyField(sample: Sample, normalizedQuery: string) {
  return Object.values(sample).some(
    (value) =>
      typeof value === "string" &&
      value.toLowerCase().includes(normalizedQuery),
  );
}

const getColumnValue = (sample: Sample, column: string) => {
  switch (column) {
    case "cliente":
      return sample.Cliente?.toLowerCase() ?? "";
    case "refDescricao":
      return sample.Ref_Descricao?.toLowerCase() ?? "";
    case "encDivmac":
      return sample.EncDivmac?.toLowerCase() ?? "";
    case "amostra":
      return sample.Amostra?.toLowerCase() ?? "";
    case "numORC":
      return sample.NumORC?.toLowerCase() ?? "";
  }
};
