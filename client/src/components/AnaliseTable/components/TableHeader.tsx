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
        <th className={`${headerCellClass} w-28`}>Descricao</th>
        <th className={`${headerCellClass} w-40 max-w-40`}>Conector</th>
        <th className={`${headerCellClass} w-36`}>RefCliente</th>
        <th className={`${headerCellClass} w-36`}>Cliente</th>
        <th className={`${headerCellClass} w-28`}>
          <DateSortButton
            onClick={onDateSortToggle}
            dateSortDirection={dateSortDirection}
            label="DataAbertura"
          />
        </th>
        <th className={`${headerCellClass} w-28`}>DataEntrega</th>
        <th className={`${headerCellClass} w-36`}>CDU_ProjetoCliente</th>
      </tr>
      {/* Filter row */}
      {showFilters && <FilterRow filters={filters} setFilters={setFilters} />}
    </thead>
  );
}

const headerCellClass =
  "table-header-cell sticky top-0 z-30 bg-slate-800/95 backdrop-blur";
