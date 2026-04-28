import { filterStyles } from "@/utils/filterUtils";
import { ConnectorFilters } from "../constants";

interface Props {
  showImages?: boolean;
  filters: ConnectorFilters;
  setFilterField: (key: keyof ConnectorFilters, value: string) => void;
  typeOptions: string[];
  fabricanteOptions: string[];
  colorOptions: string[];
}

function FilterRow({
  showImages = false,
  filters,
  setFilterField,
  typeOptions,
  fabricanteOptions,
  colorOptions,
}: Props) {
  return (
    <tr id="connectors-filter-row" className="bg-slate-900/50">
      {showImages && <th className="px-2 py-2" />}
      <th className="px-2 py-2 align-top">
        <input
          id="connector-id-search"
          type="text"
          value={filters.idQuery}
          onChange={(e) => setFilterField("idQuery", e.target.value)}
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2 align-top">
        <input
          id="connector-pos-search"
          type="text"
          value={filters.posQuery}
          onChange={(e) => setFilterField("posQuery", e.target.value)}
          placeholder="All"
          className={filterStyles.input}
        />
      </th>{" "}
      <th className="px-2 py-2 align-top">
        <select
          id="connector-color-filter"
          value={filters.color}
          onChange={(e) => setFilterField("color", e.target.value)}
          className={filterStyles.select}
        >
          <option value="all">All</option>
          {colorOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </th>
      <th className="px-2 py-2 align-top">
        <input
          id="connector-vias-filter"
          type="text"
          value={filters.vias}
          onChange={(e) => setFilterField("vias", e.target.value)}
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2 align-top">
        <select
          id="connector-type-filter"
          value={filters.type}
          onChange={(e) => setFilterField("type", e.target.value)}
          className={filterStyles.select}
        >
          <option value="all">All</option>
          {typeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </th>
      <th className="px-2 py-2 align-top">
        <input
          id="connector-family-filter"
          type="text"
          value={filters.family}
          onChange={(e) => setFilterField("family", e.target.value)}
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2 align-top">
        <select
          id="connector-fabricante-filter"
          value={filters.fabricante}
          onChange={(e) => setFilterField("fabricante", e.target.value)}
          className={filterStyles.select}
        >
          <option value="all">All</option>
          {fabricanteOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </th>
      <th className="px-2 py-2 align-top">
        <input
          id="connector-refabricante-filter"
          type="text"
          value={filters.refFabricante}
          onChange={(e) => setFilterField("refFabricante", e.target.value)}
          placeholder="All"
          className={filterStyles.input}
        />
      </th>{" "}
      <th className="px-2 py-2 align-top">
        <div className="grid grid-cols-3 gap-2">
          <input
            id="connector-intdiameter-filter"
            type="text"
            value={filters.internalDiameter}
            onChange={(e) => setFilterField("internalDiameter", e.target.value)}
            placeholder="Int"
            className={filterStyles.input}
          />
          <input
            id="connector-extdiameter-filter"
            type="text"
            value={filters.externalDiameter}
            onChange={(e) => setFilterField("externalDiameter", e.target.value)}
            placeholder="Ext"
            className={filterStyles.input}
          />
          <input
            id="connector-thickness-filter"
            type="text"
            value={filters.thickness}
            onChange={(e) => setFilterField("thickness", e.target.value)}
            placeholder="Thick"
            className={filterStyles.input}
          />
        </div>
      </th>
      <th className="px-2 py-2" />
      <th className="px-2 py-2" />
      <th className="px-2 py-2" />
      <th className="px-2 py-2" />
    </tr>
  );
}

export default FilterRow;
