import React from "react";
import { X } from "lucide-react";
type filterColumns =
  | "all"
  | "id"
  | "type"
  | "fabricante"
  | "refClient"
  | "connName"
  | "cliente"
  | "refDescricao"
  | "encDivmac"
  | "amostra";

interface Props {
  filterColumn: filterColumns;
  searchQuery: string;
  filterByOptions: filterColumns[];
  onFilterColumnChange: (column: filterColumns) => void;
  onSearchQueryChange: (query: string) => void;
}

export const FilterBar: React.FC<Props> = ({
  filterColumn,
  searchQuery,
  filterByOptions,
  onFilterColumnChange,
  onSearchQueryChange,
}) => {
  const inputBase =
    "w-full p-1 sm:p-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400";
  const inputFocus =
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  const getPlaceholder = () => {
    if (filterByOptions.includes(filterColumn)) {
      return `Filter by ${
        filterColumn.charAt(0).toUpperCase() + filterColumn.slice(1)
      }...`;
    }
    return "Search all columns...";
  };

  return (
    <div
      id="filters-bar"
      className="text-sm sm:text-base flex flex-col sm:flex-row gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700"
    >
      {/* Filter Column Selector */}
      <div className="w-full sm:w-48">
        <label
          htmlFor="filters-table-filterBy"
          className="block font-semibold mb-1 sm:mb-2"
        >
          Filter By
        </label>
        <select
          id="filters-table-filterBy"
          value={filterColumn}
          onChange={(e) =>
            onFilterColumnChange(e.target.value as filterColumns)
          }
          className={`${inputBase} ${inputFocus}`}
        >
          <option value="all">All</option>
          {filterByOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      <div className="w-full sm:w-64 relative">
        <label
          htmlFor="table-search"
          className="block font-semibold mb-1 sm:mb-2"
        >
          Search
        </label>

        <input
          id="table-search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder={getPlaceholder()}
          className={`${inputBase} ${inputFocus} pr-8`}
        />

        {searchQuery && (
          <button
            type="button"
            className="absolute right-2 top-[34px] text-slate-400 hover:text-slate-200 p-1"
            onClick={() => onSearchQueryChange("")}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};
