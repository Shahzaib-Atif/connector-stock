import { useState, useMemo, useCallback } from "react";
import { Sample } from "@/types";

interface SampleFilters {
  cliente: string;
  refDescricao: string;
  encDivmac: string;
}

interface UseSampleFiltersReturn {
  filters: SampleFilters;
  setCliente: (value: string) => void;
  setRefDescricao: (value: string) => void;
  setEncDivmac: (value: string) => void;
  filteredSamples: Sample[];
  clearFilters: () => void;
}

export function useSampleFilters(samples: Sample[]): UseSampleFiltersReturn {
  const [filters, setFilters] = useState<SampleFilters>({
    cliente: "",
    refDescricao: "",
    encDivmac: "",
  });

  const setCliente = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, cliente: value }));
  }, []);

  const setRefDescricao = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, refDescricao: value }));
  }, []);

  const setEncDivmac = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, encDivmac: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ cliente: "", refDescricao: "", encDivmac: "" });
  }, []);

  const filteredSamples = useMemo(() => {
    return samples.filter((sample) => {
      const matchesCliente =
        !filters.cliente ||
        (sample.Cliente?.toLowerCase() || "").includes(
          filters.cliente.toLowerCase()
        );
      const matchesRefDescricao =
        !filters.refDescricao ||
        (sample.Ref_Descricao?.toLowerCase() || "").includes(
          filters.refDescricao.toLowerCase()
        );
      const matchesEncDivmac =
        !filters.encDivmac ||
        (sample.EncDivmac?.toLowerCase() || "").includes(
          filters.encDivmac.toLowerCase()
        );
      return matchesCliente && matchesRefDescricao && matchesEncDivmac;
    });
  }, [samples, filters]);

  return {
    filters,
    setCliente,
    setRefDescricao,
    setEncDivmac,
    filteredSamples,
    clearFilters,
  };
}
