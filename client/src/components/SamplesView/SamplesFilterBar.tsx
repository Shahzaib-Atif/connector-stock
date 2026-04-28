import React from "react";
import { Eraser, Filter } from "lucide-react";
import { ActiveFiltersIndicator } from "../common/ActiveFiltersIndicator";
import {
  FILTER_BAR_CONTAINER,
  FILTER_BAR_TOP_ROW,
  filterStyles,
} from "@/utils/filterUtils";

interface SamplesFilterBarProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  children?: React.ReactNode;
}

export const SamplesFilterBar: React.FC<SamplesFilterBarProps> = ({
  showFilters,
  onToggleFilters,
  onClearFilters,
  activeFiltersCount,
  children,
}) => {
  return (
    <div id="samples-filter-bar" className={FILTER_BAR_CONTAINER}>
      <div className={FILTER_BAR_TOP_ROW}>
        <div className="flex-row">
          <button
            type="button"
            onClick={onToggleFilters}
            className={filterStyles.button}
            aria-expanded={showFilters}
            aria-controls="samples-filter-row"
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
