import React from "react";
import { AccessoryFilterColumn } from "@/hooks/useAccessoryFilters";

interface Props {
  filterColumn: AccessoryFilterColumn;
  searchQuery: string;
  onFilterColumnChange: (column: AccessoryFilterColumn) => void;
  onSearchQueryChange: (query: string) => void;
}

export const FilterBar: React.FC<Props> = ({
  filterColumn,
  searchQuery,
  onFilterColumnChange,
  onSearchQueryChange,
}) => {
  const inputClass =
    "w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const selectClass =
    "w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  const getPlaceholder = () => {
    switch (filterColumn) {
      case "id":
        return "Filter by ID...";
      case "type":
        return "Filter by type...";
      case "refClient":
        return "Filter by Ref. Client...";
      case "connName":
        return "Filter by connector...";
      default:
        return "Search all columns...";
    }
  };

  return (
    <div
      id="accessories-filter-bar"
      className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700"
    >
      {/* Filter Column Selector */}
      <div className="w-full sm:w-48">
        <label
          htmlFor="accessories-table-filterBy"
          className="block text-sm font-semibold text-slate-300 mb-2"
        >
          Filter By
        </label>
        <select
          id="accessories-table-filterBy"
          value={filterColumn}
          onChange={(e) =>
            onFilterColumnChange(e.target.value as AccessoryFilterColumn)
          }
          className={selectClass}
        >
          <option value="all">All</option>
          <option value="id">ID</option>
          <option value="type">Type</option>
          <option value="refClient">Ref. Client</option>
          <option value="connName">Connector</option>
        </select>
      </div>

      {/* Search Input */}
      <div className="w-full sm:w-64 relative">
        <label
          htmlFor="accessories-table-search"
          className="block text-sm font-semibold text-slate-300 mb-2"
        >
          Search
        </label>

        <input
          id="accessories-table-search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder={getPlaceholder()}
          className={`${inputClass} pr-8`}
        />

        {searchQuery && (
          <button
            type="button"
            className="absolute right-2 top-[36px] text-slate-400 hover:text-slate-200"
            onClick={() => onSearchQueryChange("")}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
