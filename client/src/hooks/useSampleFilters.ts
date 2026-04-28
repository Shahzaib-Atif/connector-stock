import { useState, useMemo, useCallback, useEffect } from "react";
import {
  SampleFilters,
  defaultFilters,
  STORAGE_KEY,
} from "@/components/SamplesView/constants";
import { SamplesDto } from "@shared/dto/SamplesDto";
import { getUniqueOptions } from "@/utils/functions/getUniqueOptions";

interface UseSampleFiltersReturn {
  filters: SampleFilters;
  setFilterField: (key: keyof SampleFilters, value: string) => void;
  filteredSamples: SamplesDto[];
  clearFilters: () => void;
  entregueOptions: string[];
}

export function useSampleFilters(
  samples: SamplesDto[],
): UseSampleFiltersReturn {
  const [filters, setFilters] = useState<SampleFilters>(() => {
    if (typeof window === "undefined") {
      return defaultFilters;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return defaultFilters;
      }

      const parsed = JSON.parse(stored) as Partial<SampleFilters>;
      return { ...defaultFilters, ...parsed };
    } catch {
      return defaultFilters;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // ignore write errors
    }
  }, [filters]);

  const setFilterField = useCallback(
    (key: keyof SampleFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const entregueOptions = useMemo(() => {
    return getUniqueOptions(samples.map((s) => s.Entregue_a));
  }, [samples]);

  const filteredSamples = useMemo(() => {
    const normalizedFilters = {
      idQuery: normalizeValue(filters.idQuery),
      cliente: normalizeValue(filters.cliente),
      projeto: normalizeValue(filters.projeto),
      encDivmac: normalizeValue(filters.encDivmac),
      refDescricao: normalizeValue(filters.refDescricao),
      amostra: normalizeValue(filters.amostra),
      numORC: normalizeValue(filters.numORC),
      nEnvio: normalizeValue(filters.nEnvio),
      entregueA: normalizeValue(filters.entregueA),
    };

    return samples.filter((sample) => {
      const matchesId =
        !normalizedFilters.idQuery ||
        normalizeValue(sample.ID).includes(normalizedFilters.idQuery);

      const matchesCliente =
        !normalizedFilters.cliente ||
        normalizeValue(sample.Cliente).includes(normalizedFilters.cliente);

      const matchesProjeto =
        !normalizedFilters.projeto ||
        normalizeValue(sample.Projeto).includes(normalizedFilters.projeto);

      const matchesEncDivmac =
        !normalizedFilters.encDivmac ||
        normalizeValue(sample.EncDivmac).includes(normalizedFilters.encDivmac);

      const matchesRefDescricao =
        !normalizedFilters.refDescricao ||
        normalizeValue(sample.Ref_Descricao).includes(
          normalizedFilters.refDescricao,
        );

      const matchesAmostra =
        !normalizedFilters.amostra ||
        normalizeValue(sample.Amostra).includes(normalizedFilters.amostra);

      const matchesNumORC =
        !normalizedFilters.numORC ||
        normalizeValue(sample.NumORC).includes(normalizedFilters.numORC);

      const matchesNEnvio =
        !normalizedFilters.nEnvio ||
        normalizeValue(sample.N_Envio).includes(normalizedFilters.nEnvio);

      const matchesEntregueA =
        !normalizedFilters.entregueA ||
        normalizeValue(sample.Entregue_a).includes(normalizedFilters.entregueA);

      return (
        matchesId &&
        matchesCliente &&
        matchesProjeto &&
        matchesEncDivmac &&
        matchesRefDescricao &&
        matchesAmostra &&
        matchesNumORC &&
        matchesNEnvio &&
        matchesEntregueA
      );
    });
  }, [samples, filters]);

  return {
    filters,
    setFilterField,
    filteredSamples,
    clearFilters,
    entregueOptions,
  };
}

function normalizeValue(value: string | number | null | undefined): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}
