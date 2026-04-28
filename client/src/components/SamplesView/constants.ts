import { getActiveFilterCount as countFilters } from "@/utils/filterUtils";

export interface SampleFilters {
  idQuery: string;
  cliente: string;
  projeto: string;
  encDivmac: string;
  refDescricao: string;
  amostra: string;
  numORC: string;
  nEnvio: string;
  entregueA: string;
}

export const STORAGE_KEY = "samples_filters_v1";

export const defaultFilters: SampleFilters = {
  idQuery: "",
  cliente: "",
  projeto: "",
  encDivmac: "",
  refDescricao: "",
  amostra: "",
  numORC: "",
  nEnvio: "",
  entregueA: "",
};

export function getActiveFilterCount(filters: SampleFilters): number {
  return countFilters(filters, defaultFilters);
}
