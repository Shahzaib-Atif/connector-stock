import React from "react";
import { Eraser, Filter } from "lucide-react";
import { useFiltersToggle } from "./ConnectorsTable/useFiltersToggle";
import { ConnectorFilters } from "./constants";

interface ConnectorsFilterBarProps {
  idQuery: string;
  type: string;
  typeOptions: string[];
  fabricante: string;
  fabricanteOptions: string[];
  family: string;
  vias: string;
  viasOptions: string[];
  color: string;
  colorOptions: string[];
  internalDiameter: string;
  externalDiameter: string;
  thickness: string;
  onClearFilters: () => void;
  setFilterField: (key: keyof ConnectorFilters, value: string) => void;
  activeFiltersCount: number;
  children?: React.ReactNode;
}

export const ConnectorsFilterBar: React.FC<ConnectorsFilterBarProps> = ({
  idQuery,
  type,
  typeOptions,
  fabricante,
  fabricanteOptions,
  family,
  vias,
  viasOptions,
  color,
  colorOptions,
  internalDiameter,
  externalDiameter,
  thickness,
  setFilterField,
  onClearFilters,
  activeFiltersCount,
  children,
}) => {
  const { showFilters, setShowFilters } = useFiltersToggle();

  const handleClear = () => {
    onClearFilters();
  };

  return (
    <div
      id="connectors-filter-bar"
      className="text-sm sm:text-base flex flex-col gap-3 sm:gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700"
    >
      {/* Top row: filter toggle + clear button + optional actions */}
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          {/* Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={btnClass}
            aria-expanded={showFilters}
            aria-controls="connectors-filter-panel"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">
              {showFilters ? "Hide filters" : "Show filters"}
            </span>
          </button>

          {/* Clear Filters Button */}
          <button type="button" onClick={handleClear} className={btnClass}>
            <Eraser className="h-4 w-4" />
            Clear filters
          </button>

          {/* Active Filters Indicator */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 animate-in fade-in zoom-in duration-300">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                {activeFiltersCount}
              </span>
              <span className="text-xs font-medium">
                {activeFiltersCount === 1 ? "Filter active" : "Filters active"}
              </span>
            </div>
          )}
        </div>

        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>

      {/* Collapsible filter panel */}
      {showFilters && (
        <div
          id="connectors-filter-panel"
          className="flex flex-col gap-3 sm:gap-4 mt-2"
        >
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            {/* ID Search */}
            <div className={containerDiv}>
              <label htmlFor="connector-id-search" className={labelClass}>
                Search ID
              </label>
              <input
                id="connector-id-search"
                type="text"
                value={idQuery}
                onChange={(e) => setFilterField("idQuery", e.target.value)}
                autoComplete="off"
                placeholder="connector Id..."
                className={inputStyle}
              />
            </div>
            {/* Vias */}
            <div className={containerDiv}>
              <label htmlFor="connector-vias-filter" className={labelClass}>
                Vias
              </label>
              <select
                id="connector-vias-filter"
                value={vias}
                onChange={(e) => setFilterField("vias", e.target.value)}
                className={selectStyle}
              >
                <option value="all">All</option>
                {viasOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {/* Color */}
            <div className={containerDiv}>
              <label htmlFor="connector-color-filter" className={labelClass}>
                Color
              </label>
              <select
                id="connector-color-filter"
                value={color}
                onChange={(e) => setFilterField("color", e.target.value)}
                className={selectStyle}
              >
                <option value="all">All</option>
                {colorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>{" "}
            {/* Type */}
            <div className={containerDiv}>
              <label htmlFor="connector-type-filter" className={labelClass}>
                Type
              </label>
              <select
                id="connector-type-filter"
                value={type}
                onChange={(e) => setFilterField("type", e.target.value)}
                className={selectStyle}
              >
                <option value="all">All</option>
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {/* Fabricante */}
            <div className={containerDiv}>
              <label
                htmlFor="connector-fabricante-filter"
                className={labelClass}
              >
                Fabricante
              </label>
              <select
                id="connector-fabricante-filter"
                value={fabricante}
                onChange={(e) => setFilterField("fabricante", e.target.value)}
                className={selectStyle}
              >
                <option value="all">All</option>
                {fabricanteOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {/* Family (text input) */}
            <div className={containerDiv}>
              <label htmlFor="connector-family-filter" className={labelClass}>
                Family
              </label>
              <input
                id="connector-family-filter"
                type="text"
                value={family}
                onChange={(e) => setFilterField("family", e.target.value)}
                autoComplete="off"
                placeholder="Enter family..."
                className={inputStyle}
              />
            </div>
          </div>

          {/* DIMENSIONS */}
          {type?.trim()?.toLowerCase() === "olhal" && (
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch">
              {/* Internal Ø (mm) */}
              <div className={containerDiv}>
                <label
                  htmlFor="connector-intdiameter-filter"
                  className={labelClass}
                >
                  Int Ø (mm)
                </label>
                <input
                  id="connector-intdiameter-filter"
                  type="text"
                  value={internalDiameter}
                  onChange={(e) =>
                    setFilterField("internalDiameter", e.target.value)
                  }
                  autoComplete="off"
                  placeholder="e.g. 5.5"
                  className={inputStyle}
                />
              </div>

              {/* External Ø (mm) */}
              <div className={containerDiv}>
                <label
                  htmlFor="connector-extdiameter-filter"
                  className={labelClass}
                >
                  Ext Ø (mm)
                </label>
                <input
                  id="connector-extdiameter-filter"
                  type="text"
                  value={externalDiameter}
                  onChange={(e) =>
                    setFilterField("externalDiameter", e.target.value)
                  }
                  autoComplete="off"
                  placeholder="e.g. 8"
                  className={inputStyle}
                />
              </div>

              {/* Thickness (mm) */}
              <div className={containerDiv}>
                <label
                  htmlFor="connector-thickness-filter"
                  className={labelClass}
                >
                  Thick (mm)
                </label>
                <input
                  id="connector-thickness-filter"
                  type="text"
                  value={thickness}
                  onChange={(e) => setFilterField("thickness", e.target.value)}
                  autoComplete="off"
                  placeholder="e.g. 1.2"
                  className={inputStyle}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const labelClass = "label-style-1 text-sm mb-[2px] px-2";
const btnClass =
  "inline-flex items-center rounded-lg border border-slate-600 px-3 py-2 text-slate-100 transition-colors text-xs sm:text-sm gap-1 hover:bg-slate-600";
const selectStyle =
  "w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500";
const containerDiv = "w-full sm:w-40";
const inputStyle =
  "w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
