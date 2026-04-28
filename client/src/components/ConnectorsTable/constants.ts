export interface ConnectorFilters {
  idQuery: string;
  posQuery: string;
  type: string;
  fabricante: string;
  refFabricante: string;
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
  posQuery: "",
  type: "all",
  fabricante: "all",
  refFabricante: "",
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
