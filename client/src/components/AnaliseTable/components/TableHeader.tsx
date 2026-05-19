import DateSortButton from "@/components/common/DateSortButton";
import { AnaliseTabFilters } from "./constants";
import FilterRow from "./FilterRow";

interface Props {
  showFilters: boolean;
  filters: AnaliseTabFilters;
  setFilters: (value: React.SetStateAction<AnaliseTabFilters>) => void;
  dateSortDirection: "asc" | "desc" | null;
  onDateSortToggle: () => void;
}

export default function TableHeader({
  showFilters,
  filters,
  setFilters,
  dateSortDirection,
  onDateSortToggle,
}: Props) {
  return (
    <thead className="table-header">
      {/* Header row */}
      <tr>
        <th className={`${headerCellClass} w-28`}>Encomenda</th>
        <th className={`${headerCellClass} w-20`}>NumLinha</th>
        <th className={`${headerCellClass} w-24`}>Estado</th>
        <th className={headerCellClass}>Descricao</th>
        <th className={headerCellClass}>Conector</th>
        <th className={headerCellClass}>RefCliente</th>
        <th className={headerCellClass}>Cliente</th>
        <th className={headerCellClass}>
          <DateSortButton
            onClick={onDateSortToggle}
            dateSortDirection={dateSortDirection}
          />
        </th>
        <th className={headerCellClass}>DataEntrega</th>
        <th className={headerCellClass}>CDU_ProjetoCliente</th>
      </tr>
      {/* Filter row */}
      {showFilters && <FilterRow filters={filters} setFilters={setFilters} />}
    </thead>
  );
}

const headerCellClass =
  "table-header-cell sticky top-0 z-30 bg-slate-800/95 backdrop-blur";
