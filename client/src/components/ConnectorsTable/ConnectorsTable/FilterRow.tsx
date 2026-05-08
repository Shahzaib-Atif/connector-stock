import {
  ClearableTextFilter,
  SelectFilter,
  StickyFilterCell,
  StickySpacerCell,
} from "@/components/common/TableFilters";
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
        <SelectFilter
          id="connector-type-filter"
          value={filters.type}
          onChange={(value) => setFilterField("type", value)}
          options={typeOptions}
        />
      </StickyFilterCell>
      <StickyFilterCell>
        <ClearableTextFilter
          id="connector-family-filter"
          value={filters.family}
          onChange={(value) => setFilterField("family", value)}
        />
      </StickyFilterCell>
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
      <StickySpacerCell />
      <StickySpacerCell />
      <StickySpacerCell />
      <StickySpacerCell />
    </tr>
  );
}

export default FilterRow;
