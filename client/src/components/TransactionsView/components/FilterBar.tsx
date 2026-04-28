import React from "react";
import { Eraser, Filter } from "lucide-react";
import { ActiveFiltersIndicator } from "@/components/common/ActiveFiltersIndicator";
import {
  FILTER_BAR_CONTAINER,
  FILTER_BAR_TOP_ROW,
  filterStyles,
  getActiveFilterCount,
} from "@/utils/filterUtils";

const defaultFilters = {
  transactionType: "all" as const,
  itemType: "all" as const,
  itemIdQuery: "",
  department: "",
  sender: "",
};

interface Props {
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  transactionType: "all" | "IN" | "OUT";
  itemType: "all" | "connector" | "accessory";
  onTransactionTypeChange: (type: "all" | "IN" | "OUT") => void;
  onItemTypeChange: (type: "all" | "connector" | "accessory") => void;
  itemIdQuery: string;
  onSearchItemIdChange: (value: string) => void;
  department: string;
  onDepartmentChange: (value: string) => void;
  sender: string;
  onSenderChange: (value: string) => void;
}

export const FilterBar: React.FC<Props> = ({
  showFilters,
  setShowFilters,
  transactionType,
  itemType,
  onTransactionTypeChange,
  onItemTypeChange,
  itemIdQuery,
  onSearchItemIdChange,
  department,
  onDepartmentChange,
  sender,
  onSenderChange,
}) => {
  const activeFiltersCount = getActiveFilterCount(
    { transactionType, itemType, itemIdQuery, department, sender },
    defaultFilters,
  );

  const clearFilters = () => {
    onTransactionTypeChange("all");
    onItemTypeChange("all");
    onSearchItemIdChange("");
    onDepartmentChange("");
    onSenderChange("");
  };

  return (
    <div id="filter-transactions" className={FILTER_BAR_CONTAINER}>
      <div className={FILTER_BAR_TOP_ROW}>
        <div className="flex-row">
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={filterStyles.button}
            aria-expanded={showFilters}
            aria-controls="transactions-filter-row"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">
              {showFilters ? "Hide filters" : "Show filters"}
            </span>
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className={filterStyles.button}
          >
            <Eraser className="h-4 w-4" />
            Clear filters
          </button>

          <ActiveFiltersIndicator count={activeFiltersCount} />
        </div>
      </div>
    </div>
  );
};
