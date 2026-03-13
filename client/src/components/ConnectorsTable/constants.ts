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
  vias: "all",
  color: "all",
  internalDiameter: "",
  externalDiameter: "",
  thickness: "",
};

export { STORAGE_KEY, defaultFilters };

/**
 * Calculates how many filters are currently active by comparing
 * current filter values with their default values.
 */
export function getActiveFilterCount(filters: ConnectorFilters): number {
  let count = 0;

  (Object.keys(defaultFilters) as Array<keyof ConnectorFilters>).forEach(
    (key) => {
      if (filters[key] !== defaultFilters[key]) {
        // For string inputs, also check if they aren't just whitespace
        if (typeof filters[key] === "string" && filters[key].trim() === "") {
          return;
        }
        count++;
      }
    },
  );

  return count;
}
