import React from "react";
import { FilterColumn } from "@/hooks/useSampleFilters";

interface Props {
  filterColumn: FilterColumn;
  searchQuery: string;
  onFilterColumnChange: (column: FilterColumn) => void;
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
      case "cliente":
        return "Filter by client...";
      case "refDescricao":
        return "Filter by reference...";
      case "encDivmac":
        return "Filter by EncDivmac...";
      case "amostra":
        return "Filter by Amostra...";
      default:
        return "Search all columns...";
    }
  };

  return (
    <div
      id="samples-filter-bar"
      className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700"
    >
      {/* Filter Column Selector */}
      <div className="w-full sm:w-48">
        <label
          htmlFor="samples-table-filterBy"
          className="block text-sm font-semibold text-slate-300 mb-2"
        >
          Filter By
        </label>
        <select
          id="samples-table-filterBy"
          value={filterColumn}
          onChange={(e) => onFilterColumnChange(e.target.value as FilterColumn)}
          className={selectClass}
        >
          <option value="all">All</option>
          <option value="cliente">Cliente</option>
          <option value="encDivmac">EncDivmac</option>
          <option value="refDescricao">Ref. Descrição</option>
          <option value="amostra">Amostra</option>
        </select>
      </div>

      {/* Search Input */}
      <div className="w-full sm:w-64 relative">
        <label
          htmlFor="samples-table-search"
          className="block text-sm font-semibold text-slate-300 mb-2"
        >
          Search
        </label>

        <input
          id="samples-table-search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder={getPlaceholder()}
          className={`${inputClass} pr-8`} // padding so the X doesn't overlap text
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
