export const VIEW_SUMMARY_CLASS =
  "bg-slate-800/50 rounded-2xl p-6 sm:pb-3 pb-1 shadow-lg border border-slate-700";

export enum STORAGE_KEYS {
  SESSION = "connector_stock_session_v1",
  CONNECTORS_FILTERS = "connectors_filters_v1",
  ACCESSORIES_FILTERS = "accessories_filters_v1",
  SELECTED_PRINTER = "selected_printer",
  USE_SMALL_LABELS = "use_small_labels",
  CONNECTORS_SHOW_IMAGES = "connectors_show_images",
  SAMPLES_FILTERS = "samples_filters_v1",
  ANALISE_TAB_FILTERS = "analise_tab_filters_v1",
  CONNECTORS_SHOW_FILTERS = "connectors_show_filters",
  CONNECTORS_LEGACY_MODE = "connectors_legacy_mode",
  ACCESSORIES_SHOW_FILTERS = "accessories_show_filters",
  SAMPLES_SHOW_FILTERS = "samples_show_filters",
  ANALISE_TAB_SHOW_FILTERS = "analise_tab_show_filters",
  TRANSACTIONS_SHOW_FILTERS = "transactions_show_filters",
}

export const AUTH_EXPIRED_EVENT = "auth:expired";

export enum Printer_t {
  PRINTER_1 = "PRINTER_1",
  PRINTER_2 = "PRINTER_2",
}
