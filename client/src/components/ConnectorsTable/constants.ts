export interface ConnectorFilters {
  idQuery: string;
  type: string;
  fabricante: string;
  family: string;
  vias: string;
  color: string;
  internalDiameter: string;
  externalDiameter: string;
  thickness: string;
}

const STORAGE_KEY = "connectors_filters_v1";

const defaultFilters: ConnectorFilters = {
  idQuery: "",
  type: "all",
  fabricante: "all",
  family: "",
  vias: "",
  color: "all",
  internalDiameter: "",
  externalDiameter: "",
  thickness: "",
};

import { getActiveFilterCount as countFilters } from "@/utils/filterUtils";

export { STORAGE_KEY, defaultFilters };

/**
 * Calculates how many filters are currently active.
 */
export function getActiveFilterCount(filters: ConnectorFilters): number {
  return countFilters(filters, defaultFilters);
}
