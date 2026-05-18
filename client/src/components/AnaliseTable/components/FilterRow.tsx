import { AnaliseTabFilters } from "./constants";
import FilterCell from "./FilterCell";

interface Props {
  filters: AnaliseTabFilters;
  setFilters: (value: React.SetStateAction<AnaliseTabFilters>) => void;
}

export default function FilterRow({ filters, setFilters }: Props) {
  const setFilterField = (key: keyof AnaliseTabFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
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
  );
}

const filterCellClass =
  "sticky top-[40px] z-20 bg-slate-900/95 px-2 py-2 align-top backdrop-blur";
