import { useEffect, useMemo, useState } from "react";
import { AnaliseTabFilters, defaultFilters } from "./constants";
import { STORAGE_KEYS } from "@/utils/constants";
import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";

interface Props {
  rows: AnaliseTabDto[];
}

export default function useFilters({ rows }: Props) {
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

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      return (
        normalizeValue(row.Encomenda).includes(
          normalizeValue(filters.encomenda),
        ) &&
        normalizeValue(row.Estado).includes(normalizeValue(filters.estado)) &&
        normalizeValue(row.Conector).includes(
          normalizeValue(filters.conector),
        ) &&
        normalizeValue(row.RefCliente).includes(
          normalizeValue(filters.refCliente),
        ) &&
        normalizeValue(row.Cliente).includes(normalizeValue(filters.cliente)) &&
        normalizeValue(row.CDU_ProjetoCliente).includes(
          normalizeValue(filters.projeto),
        ) &&
        normalizeValue(row.Artigo).includes(normalizeValue(filters.artigo)) &&
        normalizeValue(row.Sector).includes(normalizeValue(filters.sector))
      );
    });
  }, [rows, filters]);

  const activeFiltersCount = Object.entries(filters).filter(([, value]) =>
    value.trim(),
  ).length;

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    filters,
    setFilters,
    filteredRows,
    activeFiltersCount,
    clearFilters,
  };
}

function normalizeValue(
  value: string | number | Date | null | undefined,
): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}
