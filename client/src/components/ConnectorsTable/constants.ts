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
