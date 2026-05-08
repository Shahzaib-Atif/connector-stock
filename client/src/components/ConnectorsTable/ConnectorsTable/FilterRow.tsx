import {
  ClearableTextFilter,
  SelectFilter,
  StickyFilterCell,
  StickySpacerCell,
} from "@/components/common/TableFilters";
import { ConnectorFilters, MISSING_TYPE_FILTER } from "../constants";

interface Props {
  showImages?: boolean;
  filters: ConnectorFilters;
  setFilterField: (key: keyof ConnectorFilters, value: string) => void;
  typeOptions: string[];
  fabricanteOptions: string[];
  colorOptions: string[];
  isLegacyMode?: boolean;
}

function FilterRow({
  showImages = false,
  isLegacyMode = false,
  filters,
  setFilterField,
  typeOptions,
  fabricanteOptions,
  colorOptions,
}: Props) {
  return (
    <tr id="connectors-filter-row" className="bg-slate-900/50">
      {showImages && <StickySpacerCell />}
      <StickyFilterCell>
        <ClearableTextFilter
          id="connector-id-search"
          value={filters.idQuery}
          onChange={(value) => setFilterField("idQuery", value)}
        />
      </StickyFilterCell>
      <StickyFilterCell>
        <ClearableTextFilter
          id="connector-pos-search"
          value={filters.posQuery}
          onChange={(value) => setFilterField("posQuery", value)}
        />
      </StickyFilterCell>
      <StickyFilterCell>
        <SelectFilter
          id="connector-color-filter"
          value={filters.color}
          onChange={(value) => setFilterField("color", value)}
          options={colorOptions}
        />
      </StickyFilterCell>
      <StickyFilterCell>
        <ClearableTextFilter
          id="connector-vias-filter"
          value={filters.vias}
          onChange={(value) => setFilterField("vias", value)}
        />
      </StickyFilterCell>
      <StickyFilterCell>
        <select
          id="connector-type-filter"
          value={filters.type}
          onChange={(e) => setFilterField("type", e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-2 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          {isLegacyMode && (
            <option value={MISSING_TYPE_FILTER}>Missing Type</option>
          )}{" "}
          {typeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </StickyFilterCell>
      {!isLegacyMode && (
        <StickyFilterCell>
          <ClearableTextFilter
            id="connector-family-filter"
            value={filters.family}
            onChange={(value) => setFilterField("family", value)}
          />
        </StickyFilterCell>
      )}
      <StickyFilterCell>
        <SelectFilter
          id="connector-fabricante-filter"
          value={filters.fabricante}
          onChange={(value) => setFilterField("fabricante", value)}
          options={fabricanteOptions}
        />
      </StickyFilterCell>
      <StickyFilterCell>
        <ClearableTextFilter
          id="connector-refabricante-filter"
          value={filters.refFabricante}
          onChange={(value) => setFilterField("refFabricante", value)}
        />
      </StickyFilterCell>
      {/* Dimensions Filter */}
      {!isLegacyMode && (
        <StickyFilterCell>
          <div className="grid grid-cols-3 gap-2">
            <ClearableTextFilter
              id="connector-intdiameter-filter"
              value={filters.internalDiameter}
              onChange={(value) => setFilterField("internalDiameter", value)}
              placeholder="Int"
            />
            <ClearableTextFilter
              id="connector-extdiameter-filter"
              value={filters.externalDiameter}
              onChange={(value) => setFilterField("externalDiameter", value)}
              placeholder="Ext"
            />
            <ClearableTextFilter
              id="connector-thickness-filter"
              value={filters.thickness}
              onChange={(value) => setFilterField("thickness", value)}
              placeholder="Thick"
            />
          </div>
        </StickyFilterCell>
      )}
      <StickySpacerCell />
      <StickySpacerCell />
      <StickySpacerCell />
      <StickySpacerCell />
    </tr>
  );
}

export default FilterRow;
