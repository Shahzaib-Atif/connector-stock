import { AccessoryFilters } from "../constants";
import { filterStyles } from "@/utils/filterUtils";

interface Props {
  filters: AccessoryFilters;
  setFilterField: (key: keyof AccessoryFilters, value: string) => void;
  typeOptions: string[];
  colorOptions: string[];
}

function FilterRow({
  filters,
  setFilterField,
  typeOptions,
  colorOptions,
}: Props) {
  return (
    <tr id="accessories-filter-row" className="bg-slate-900/50">
      <th className="px-2 py-2" />
      <th className="px-2 py-2 align-top">
        <input
          id="acc-id-search"
          type="text"
          value={filters.idQuery}
          onChange={(e) => setFilterField("idQuery", e.target.value)}
          autoComplete="off"
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2 align-top">
        <input
          id="acc-conn-search"
          type="text"
          value={filters.connName}
          onChange={(e) => setFilterField("connName", e.target.value)}
          autoComplete="off"
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2 align-top">
        <select
          id="acc-type-filter"
          value={filters.type}
          onChange={(e) => setFilterField("type", e.target.value)}
          className={filterStyles.select}
        >
          <option value="all">All</option>
          {typeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </th>
      <th className="px-2 py-2 align-top">
        <input
          id="acc-refclient-search"
          type="text"
          value={filters.refClient}
          onChange={(e) => setFilterField("refClient", e.target.value)}
          autoComplete="off"
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2 align-top">
        <input
          id="acc-refdv-search"
          type="text"
          value={filters.refDV}
          onChange={(e) => setFilterField("refDV", e.target.value)}
          autoComplete="off"
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2 align-top">
        <select
          id="acc-color-filter"
          value={filters.clipColor}
          onChange={(e) => setFilterField("clipColor", e.target.value)}
          className={filterStyles.select}
        >
          <option value="all">All</option>
          {colorOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </th>
      <th className="px-2 py-2" />
      <th className="px-2 py-2" />
    </tr>
  );
}

export default FilterRow;
