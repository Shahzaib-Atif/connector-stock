import {
  ClearableTextFilter,
  SelectFilter,
  StickyFilterCell,
  StickySpacerCell,
} from "@/components/common/TableFilters";
import { AccessoryFilters } from "../constants";

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
      <StickySpacerCell />
      <StickyFilterCell>
        <ClearableTextFilter
          id="acc-id-search"
          value={filters.idQuery}
          onChange={(value) => setFilterField("idQuery", value)}
          autoComplete="off"
        />
      </StickyFilterCell>
      <StickyFilterCell>
        <ClearableTextFilter
          id="acc-conn-search"
          value={filters.connName}
          onChange={(value) => setFilterField("connName", value)}
          autoComplete="off"
        />
      </StickyFilterCell>
      <StickyFilterCell>
        <SelectFilter
          id="acc-type-filter"
          value={filters.type}
          onChange={(value) => setFilterField("type", value)}
          options={typeOptions}
        />
      </StickyFilterCell>
      <StickyFilterCell>
        <ClearableTextFilter
          id="acc-refclient-search"
          value={filters.refClient}
          onChange={(value) => setFilterField("refClient", value)}
          autoComplete="off"
        />
      </StickyFilterCell>
      <StickyFilterCell>
        <ClearableTextFilter
          id="acc-refdv-search"
          value={filters.refDV}
          onChange={(value) => setFilterField("refDV", value)}
          autoComplete="off"
        />
      </StickyFilterCell>
      <StickyFilterCell>
        <SelectFilter
          id="acc-color-filter"
          value={filters.clipColor}
          onChange={(value) => setFilterField("clipColor", value)}
          options={colorOptions}
        />
      </StickyFilterCell>
      <StickySpacerCell />
      <StickySpacerCell />
    </tr>
  );
}

export default FilterRow;
