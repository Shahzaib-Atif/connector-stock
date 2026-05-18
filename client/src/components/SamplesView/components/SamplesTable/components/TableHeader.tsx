import React from "react";
import { SampleFilters } from "../../../constants";
import FilterRow from "./FilterRow";

interface TableHeaderProps {
  showActions?: boolean;
  showFilters?: boolean;
  filters: SampleFilters;
  setFilterField: (key: keyof SampleFilters, value: string) => void;
  entregueOptions: string[];
  dateSortDirection: "asc" | "desc" | null;
  onDateSortToggle: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  showActions = true,
  showFilters = false,
  filters,
  setFilterField,
  // entregueOptions,
  dateSortDirection,
  onDateSortToggle,
}) => {
  const headerCellClass =
    "table-header-cell sticky top-0 z-30 bg-slate-800/95 backdrop-blur";

  return (
    <thead className="table-header">
      {/* Header Row */}
      <tr>
        <th className={`${headerCellClass} w-48`}>Cliente</th>
        <th className={`${headerCellClass} w-32`}>EncDivmac</th>
        <th className={`${headerCellClass} w-40`}>Ref. Descrição</th>
        <th className={`${headerCellClass} w-40`}>Amostra</th>
        <th className={`${headerCellClass} w-32`}>NumORC</th>
        <th className={`${headerCellClass} w-48`}>N_Envio</th>
        <th className={`${headerCellClass} w-30`}>Qty.</th>
        <th className={`${headerCellClass} w-30`}>
          <button
            type="button"
            onClick={onDateSortToggle}
            className="flex items-center gap-1 text-left"
          >
            <span>Data Receção</span>
            {dateSortDirection && (
              <span aria-hidden="true">
                {dateSortDirection === "asc" ? "↑" : "↓"}
              </span>
            )}
          </button>
        </th>
        <th className={`${headerCellClass} w-36`}>Observacoes</th>
        {showActions && (
          <th className={`${headerCellClass} text-center`}>Actions</th>
        )}
      </tr>
      {/* Filter Row */}
      {showFilters && (
        <FilterRow
          showActions={showActions}
          filters={filters}
          setFilterField={setFilterField}
        />
      )}
    </thead>
  );
};

export default TableHeader;
