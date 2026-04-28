import { SampleFilters } from "@/components/SamplesView/constants";
import { filterStyles } from "@/utils/filterUtils";

interface Props {
  showActions?: boolean;
  filters: SampleFilters;
  setFilterField: (key: keyof SampleFilters, value: string) => void;
}

function FilterRow({ showActions = true, filters, setFilterField }: Props) {
  return (
    <tr id="samples-filter-row" className="bg-slate-900/50">
      <th className="px-2 py-2"></th>
      <th className="px-2 py-2 align-top">
        <input
          id="sample-cliente-search"
          type="text"
          value={filters.cliente}
          onChange={(e) => setFilterField("cliente", e.target.value)}
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2 align-top">
        <input
          id="sample-projeto-search"
          type="text"
          value={filters.projeto}
          onChange={(e) => setFilterField("projeto", e.target.value)}
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2 align-top">
        <input
          id="sample-encdivmac-search"
          type="text"
          value={filters.encDivmac}
          onChange={(e) => setFilterField("encDivmac", e.target.value)}
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2 align-top">
        <input
          id="sample-refdescricao-search"
          type="text"
          value={filters.refDescricao}
          onChange={(e) => setFilterField("refDescricao", e.target.value)}
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2 align-top">
        <input
          id="sample-amostra-search"
          type="text"
          value={filters.amostra}
          onChange={(e) => setFilterField("amostra", e.target.value)}
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2 align-top">
        <input
          id="sample-numorc-search"
          type="text"
          value={filters.numORC}
          onChange={(e) => setFilterField("numORC", e.target.value)}
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2 align-top">
        <input
          id="sample-nenvio-search"
          type="text"
          value={filters.nEnvio}
          onChange={(e) => setFilterField("nEnvio", e.target.value)}
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2 align-top">
        <input
          id="sample-entreguea-search"
          type="text"
          value={filters.entregueA}
          onChange={(e) => setFilterField("entregueA", e.target.value)}
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2" />
      <th className="px-2 py-2" />
      <th className="px-2 py-2" />
      {showActions && <th className="px-2 py-2" />}
    </tr>
  );
}

export default FilterRow;
