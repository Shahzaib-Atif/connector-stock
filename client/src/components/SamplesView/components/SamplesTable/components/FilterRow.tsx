import { SampleFilters } from "@/components/SamplesView/constants";
import { filterStyles } from "@/utils/filterUtils";
import { X } from "lucide-react";

interface Props {
  showActions?: boolean;
  filters: SampleFilters;
  setFilterField: (key: keyof SampleFilters, value: string) => void;
}

type FilterKey =
  | "cliente"
  | "encDivmac"
  | "refDescricao"
  | "amostra"
  | "numORC"
  | "nEnvio";

function FilterInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const hasValue = value.trim().length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="All"
        className={`${filterStyles.input} pr-8`}
      />
      {hasValue && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded text-slate-400 hover:text-white"
          title="Clear filter"
          aria-label="Clear filter"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function FilterCell({
  id,
  value,
  filterKey,
  setFilterField,
}: {
  id: string;
  value: string;
  filterKey: FilterKey;
  setFilterField: (key: keyof SampleFilters, value: string) => void;
}) {
  return (
    <th className="px-2 py-2 align-top">
      <FilterInput
        id={id}
        value={value}
        onChange={(nextValue) => setFilterField(filterKey, nextValue)}
      />
    </th>
  );
}

function FilterRow({ showActions = true, filters, setFilterField }: Props) {
  console.log("showActions: ", showActions);

  return (
    <tr id="samples-filter-row" className="bg-slate-900/50">
      <FilterCell
        id="sample-cliente-search"
        value={filters.cliente}
        filterKey="cliente"
        setFilterField={setFilterField}
      />
      <FilterCell
        id="sample-encdivmac-search"
        value={filters.encDivmac}
        filterKey="encDivmac"
        setFilterField={setFilterField}
      />
      <FilterCell
        id="sample-refdescricao-search"
        value={filters.refDescricao}
        filterKey="refDescricao"
        setFilterField={setFilterField}
      />
      <FilterCell
        id="sample-amostra-search"
        value={filters.amostra}
        filterKey="amostra"
        setFilterField={setFilterField}
      />
      <FilterCell
        id="sample-numorc-search"
        value={filters.numORC}
        filterKey="numORC"
        setFilterField={setFilterField}
      />
      <FilterCell
        id="sample-nenvio-search"
        value={filters.nEnvio}
        filterKey="nEnvio"
        setFilterField={setFilterField}
      />
      <th className="px-2 py-2" />
      <th className="px-2 py-2" />
      <th className="px-2 py-2" />
      {showActions && <th className="px-2 py-2" />}
    </tr>
  );
}

export default FilterRow;
