import React from "react";
import { ConnectorFilterColumn } from "@/hooks/useConnectorFilters";

interface Props {
  filterColumn: ConnectorFilterColumn;
  searchQuery: string;
  onFilterColumnChange: (column: ConnectorFilterColumn) => void;
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
      case "fabricante":
        return "Filter by fabricante...";
      default:
        return "Search all columns...";
    }
  };

  return (
    <div
      id="connectors-filter-bar"
      className="text-sm sm:text-base flex flex-col sm:flex-row gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700"
    >
      {/* Filter Column Selector */}
      <div className="w-full sm:w-48">
        <label
          htmlFor="connectors-table-filterBy"
          className="block font-semibold mb-1 sm:mb-2"
        >
          Filter By
        </label>
        <select
          id="connectors-table-filterBy"
          value={filterColumn}
          onChange={(e) =>
            onFilterColumnChange(e.target.value as ConnectorFilterColumn)
          }
          className={selectClass}
        >
          <option value="all">All</option>
          <option value="id">ID</option>
          <option value="type">Type</option>
          <option value="fabricante">Fabricante</option>
        </select>
      </div>

      {/* Search Input */}
      <div className="w-full sm:w-64 relative">
        <label
          htmlFor="connectors-table-search"
          className="block font-semibold mb-1 sm:mb-2"
        >
          Search
        </label>

        <input
          id="connectors-table-search"
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
