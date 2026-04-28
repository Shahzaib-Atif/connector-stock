import React from "react";
import { Eraser, Filter } from "lucide-react";
import { AccessoryFilters, defaultFilters } from "./constants";
import { ActiveFiltersIndicator } from "../common/ActiveFiltersIndicator";
import {
  FILTER_BAR_CONTAINER,
  FILTER_BAR_TOP_ROW,
  filterStyles,
  getActiveFilterCount,
} from "@/utils/filterUtils";

interface AccessoriesFilterBarProps {
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  filters: AccessoryFilters;
  onClearFilters: () => void;
  children?: React.ReactNode;
}

export const AccessoriesFilterBar: React.FC<AccessoriesFilterBarProps> = ({
  showFilters,
  setShowFilters,
  filters,
  onClearFilters,
  children,
}) => {
  const activeFiltersCount = getActiveFilterCount(filters, defaultFilters);

  return (
    <div id="accessories-filter-bar" className={FILTER_BAR_CONTAINER}>
      {/* Filter Bar Top Row */}
      <div className={FILTER_BAR_TOP_ROW}>
        <div className="flex-row">
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

        {children && <div className="flex-row">{children}</div>}
      </div>
    </div>
  );
};
