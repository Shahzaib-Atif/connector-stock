import React from "react";
import { Eraser, Filter } from "lucide-react";
import { AccessoryFilters, defaultFilters } from "./constants";
import { useFiltersToggle } from "../ConnectorsTable/ConnectorsTable/useFiltersToggle";
import { ActiveFiltersIndicator } from "../common/ActiveFiltersIndicator";
import { filterStyles, getActiveFilterCount } from "@/utils/filterUtils";

interface AccessoriesFilterBarProps {
  filters: AccessoryFilters;
  setFilterField: (key: keyof AccessoryFilters, value: string) => void;
  onClearFilters: () => void;
  typeOptions: string[];
  colorOptions: string[];
  children?: React.ReactNode;
}

export const AccessoriesFilterBar: React.FC<AccessoriesFilterBarProps> = ({
  filters,
  setFilterField,
  onClearFilters,
  typeOptions,
  colorOptions,
  children,
}) => {
  const { showFilters, setShowFilters } = useFiltersToggle();
  const activeFiltersCount = getActiveFilterCount(filters, defaultFilters);

  return (
    <div
      id="accessories-filter-bar"
      className="text-sm sm:text-base flex flex-col gap-3 sm:gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700"
    >
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={filterStyles.button}
            aria-expanded={showFilters}
            aria-controls="accessories-filter-panel"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">
              {showFilters ? "Hide filters" : "Show filters"}
            </span>
          </button>

          <button
            type="button"
            onClick={onClearFilters}
            className={filterStyles.button}
          >
            <Eraser className="h-4 w-4" />
            Clear filters
          </button>

          <ActiveFiltersIndicator count={activeFiltersCount} />
        </div>

        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>

      {showFilters && (
        <div
          id="accessories-filter-panel"
          className="flex flex-col gap-3 sm:gap-4 mt-2"
        >
          {" "}
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            {/* ID Search */}
            <div className={filterStyles.container}>
              <label htmlFor="acc-id-search" className={filterStyles.label}>
                Search ID
              </label>
              <input
                id="acc-id-search"
                type="text"
                value={filters.idQuery}
                onChange={(e) => setFilterField("idQuery", e.target.value)}
                autoComplete="off"
                placeholder="accessory Id..."
                className={filterStyles.input}
              />
            </div>
            {/* Type Filter */}
            <div className={filterStyles.container}>
              <label htmlFor="acc-type-filter" className={filterStyles.label}>
                Type
              </label>
              <select
                id="acc-type-filter"
                value={filters.type}
                onChange={(e) => setFilterField("type", e.target.value)}
                className={filterStyles.select}
              >
                <option value="all">All Types</option>
                {typeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {/* Connector Name */}
            <div className={filterStyles.container}>
              <label htmlFor="acc-conn-search" className={filterStyles.label}>
                Connector Name
              </label>
              <input
                id="acc-conn-search"
                type="text"
                value={filters.connName}
                onChange={(e) => setFilterField("connName", e.target.value)}
                autoComplete="off"
                placeholder="connector name..."
                className={filterStyles.input}
              />
            </div>
            {/* Ref Client */}
            <div className={filterStyles.container}>
              <label
                htmlFor="acc-refclient-search"
                className={filterStyles.label}
              >
                Ref Client
              </label>
              <input
                id="acc-refclient-search"
                type="text"
                value={filters.refClient}
                onChange={(e) => setFilterField("refClient", e.target.value)}
                autoComplete="off"
                placeholder="ref client..."
                className={filterStyles.input}
              />
            </div>
            {/* Ref DV */}
            <div className={filterStyles.container}>
              <label htmlFor="acc-refdv-search" className={filterStyles.label}>
                Ref DV
              </label>
              <input
                id="acc-refdv-search"
                type="text"
                value={filters.refDV}
                onChange={(e) => setFilterField("refDV", e.target.value)}
                autoComplete="off"
                placeholder="ref DV..."
                className={filterStyles.input}
              />
            </div>
            {/* Clip Color */}
            <div className={filterStyles.container}>
              <label htmlFor="acc-color-filter" className={filterStyles.label}>
                Clip Color
              </label>
              <select
                id="acc-color-filter"
                value={filters.clipColor}
                onChange={(e) => setFilterField("clipColor", e.target.value)}
                className={filterStyles.select}
              >
                <option value="all">All Colors</option>
                {colorOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>{" "}
          </div>
        </div>
      )}
    </div>
  );
};
