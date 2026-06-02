import { STORAGE_KEYS } from "@/utils/constants";
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
  quantidade: string;
  dataRecepcao: string;
  entregueA: string;
  observacoes: string;
}

export const STORAGE_KEY = STORAGE_KEYS.SAMPLES_FILTERS;

export const defaultFilters: SampleFilters = {
  idQuery: "",
  cliente: "",
  projeto: "",
  encDivmac: "",
  refDescricao: "",
  amostra: "",
  numORC: "",
  nEnvio: "",
  quantidade: "",
  dataRecepcao: "",
  entregueA: "",
  observacoes: "",
};

export function getActiveFilterCount(filters: SampleFilters): number {
  return countFilters(filters, defaultFilters);
}
