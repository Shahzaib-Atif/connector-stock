import React from "react";
import { Eraser, Filter } from "lucide-react";
import { useFiltersToggle } from "./ConnectorsTable/useFiltersToggle";
import { ConnectorFilters } from "./constants";
import { ActiveFiltersIndicator } from "../common/ActiveFiltersIndicator";
import {
  FILTER_BAR_CONTAINER,
  FILTER_BAR_TOP_ROW,
  filterStyles,
} from "@/utils/filterUtils";

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
    <div id="connectors-filter-bar" className={FILTER_BAR_CONTAINER}>
      {/* Top row: filter toggle + clear button + optional actions */}
      <div className={FILTER_BAR_TOP_ROW}>
        <div className="flex-row">
          {/* Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={filterStyles.button}
            aria-expanded={showFilters}
            aria-controls="connectors-filter-panel"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">
              {showFilters ? "Hide filters" : "Show filters"}
            </span>
          </button>

          {/* Clear Filters Button */}
          <button
            type="button"
            onClick={handleClear}
            className={filterStyles.button}
          >
            <Eraser className="h-4 w-4" />
            Clear filters
          </button>

          <ActiveFiltersIndicator count={activeFiltersCount} />
        </div>

        {children && <div className="flex-row">{children}</div>}
      </div>

      {/* Collapsible filter panel */}
      {showFilters && (
        <div
          id="connectors-filter-panel"
          className="flex flex-col gap-3 sm:gap-4 mt-2"
        >
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            {/* ID Search */}
            <div className={filterStyles.container}>
              <label
                htmlFor="connector-id-search"
                className={filterStyles.label}
              >
                Search ID
              </label>
              <input
                id="connector-id-search"
                type="text"
                value={idQuery}
                onChange={(e) => setFilterField("idQuery", e.target.value)}
                autoComplete="off"
                placeholder="connector Id..."
                className={filterStyles.input}
              />
            </div>
            {/* Vias */}
            <div className={filterStyles.container}>
              <label
                htmlFor="connector-vias-filter"
                className={filterStyles.label}
              >
                Vias
              </label>
              <select
                id="connector-vias-filter"
                value={vias}
                onChange={(e) => setFilterField("vias", e.target.value)}
                className={filterStyles.select}
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
            <div className={filterStyles.container}>
              <label
                htmlFor="connector-color-filter"
                className={filterStyles.label}
              >
                Color
              </label>
              <select
                id="connector-color-filter"
                value={color}
                onChange={(e) => setFilterField("color", e.target.value)}
                className={filterStyles.select}
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
            <div className={filterStyles.container}>
              <label
                htmlFor="connector-type-filter"
                className={filterStyles.label}
              >
                Type
              </label>
              <select
                id="connector-type-filter"
                value={type}
                onChange={(e) => setFilterField("type", e.target.value)}
                className={filterStyles.select}
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
            <div className={filterStyles.container}>
              <label
                htmlFor="connector-fabricante-filter"
                className={filterStyles.label}
              >
                Fabricante
              </label>
              <select
                id="connector-fabricante-filter"
                value={fabricante}
                onChange={(e) => setFilterField("fabricante", e.target.value)}
                className={filterStyles.select}
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
            <div className={filterStyles.container}>
              <label
                htmlFor="connector-family-filter"
                className={filterStyles.label}
              >
                Family
              </label>
              <input
                id="connector-family-filter"
                type="text"
                value={family}
                onChange={(e) => setFilterField("family", e.target.value)}
                autoComplete="off"
                placeholder="Enter family..."
                className={filterStyles.input}
              />
            </div>
          </div>

          {/* DIMENSIONS */}
          {type?.trim()?.toLowerCase() === "olhal" && (
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch">
              {/* Internal Ø (mm) */}
              <div className={filterStyles.container}>
                <label
                  htmlFor="connector-intdiameter-filter"
                  className={filterStyles.label}
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
                  className={filterStyles.input}
                />
              </div>

              {/* External Ø (mm) */}
              <div className={filterStyles.container}>
                <label
                  htmlFor="connector-extdiameter-filter"
                  className={filterStyles.label}
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
                  className={filterStyles.input}
                />
              </div>

              {/* Thickness (mm) */}
              <div className={filterStyles.container}>
                <label
                  htmlFor="connector-thickness-filter"
                  className={filterStyles.label}
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
                  className={filterStyles.input}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
