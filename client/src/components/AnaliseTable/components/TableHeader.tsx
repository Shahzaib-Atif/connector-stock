import { AnaliseTabFilters } from "./constants";
import FilterCell from "./FilterCell";

interface Props {
  showFilters: boolean;
  filters: AnaliseTabFilters;
  setFilters: (value: React.SetStateAction<AnaliseTabFilters>) => void;
}

export default function TableHeader({
  showFilters,
  filters,
  setFilters,
}: Props) {
  const setFilterField = (key: keyof AnaliseTabFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <thead className="table-header">
      {/* Header row */}
      <tr>
        <th className={headerCellClass}>Encomenda</th>
        <th className={headerCellClass}>NumLinha</th>
        <th className={headerCellClass}>Estado</th>
        <th className={headerCellClass}>Descricao</th>
        <th className={headerCellClass}>Conector</th>
        <th className={headerCellClass}>RefCliente</th>
        <th className={headerCellClass}>Cliente</th>
        <th className={headerCellClass}>DataAbertura</th>
        <th className={headerCellClass}>DataEntrega</th>
        <th className={headerCellClass}>CDU_ProjetoCliente</th>
      </tr>
      {/* Filter row */}
      {showFilters && (
        <tr id="analise-tab-filter-row" className="bg-slate-900/50">
          <FilterCell
            id="analise-encomenda-filter"
            value={filters.encomenda}
            onChange={(value) => setFilterField("encomenda", value)}
          />
          <FilterCell
            id="analise-estado-filter"
            value={filters.numLinha}
            onChange={(value) => setFilterField("numLinha", value)}
          />{" "}
          <FilterCell
            id="analise-estado-filter"
            value={filters.estado}
            onChange={(value) => setFilterField("estado", value)}
          />
          <FilterCell
            id="analise-estado-filter"
            value={filters.descricao}
            onChange={(value) => setFilterField("descricao", value)}
          />{" "}
          <FilterCell
            id="analise-conector-filter"
            value={filters.conector}
            onChange={(value) => setFilterField("conector", value)}
          />
          <FilterCell
            id="analise-refcliente-filter"
            value={filters.refCliente}
            onChange={(value) => setFilterField("refCliente", value)}
          />
          <FilterCell
            id="analise-cliente-filter"
            value={filters.cliente}
            onChange={(value) => setFilterField("cliente", value)}
          />
          <th className={filterCellClass} />
          <th className={filterCellClass} />
          <FilterCell
            id="analise-projeto-filter"
            value={filters.projeto}
            onChange={(value) => setFilterField("projeto", value)}
          />
        </tr>
      )}
    </thead>
  );
}

const headerCellClass =
  "table-header-cell sticky top-0 z-30 bg-slate-800/95 backdrop-blur";

const filterCellClass =
  "sticky top-[40px] z-20 bg-slate-900/95 px-2 py-2 align-top backdrop-blur";
