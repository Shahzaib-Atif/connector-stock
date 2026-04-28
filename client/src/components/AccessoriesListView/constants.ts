export interface AccessoryFilters {
  idQuery: string;
  type: string;
  connName: string;
  refClient: string;
  refDV: string;
  angle: string;
  clipColor: string;
  qty: string;
}

export const STORAGE_KEY = "accessories_filters_v1";

export const defaultFilters: AccessoryFilters = {
  idQuery: "",
  type: "all",
  connName: "",
  refClient: "",
  refDV: "",
  angle: "",
  clipColor: "all",
  qty: "",
};
