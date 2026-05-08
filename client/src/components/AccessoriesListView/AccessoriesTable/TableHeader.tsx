import React from "react";
import { AccessoryFilters } from "../constants";
import FilterRow from "./FilterRow";
import { StickyHeaderCell } from "@/components/common/TableFilters";

interface TableHeaderProps {
  showFilters?: boolean;
  filters: AccessoryFilters;
  setFilterField: (key: keyof AccessoryFilters, value: string) => void;
  typeOptions: string[];
  colorOptions: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({
  showFilters = false,
  filters,
  setFilterField,
  typeOptions,
  colorOptions,
}) => {
  return (
    <thead className="table-header">
      <tr>
        <StickyHeaderCell className="w-20">Photo</StickyHeaderCell>
        <StickyHeaderCell className="w-28">Name</StickyHeaderCell>
        <StickyHeaderCell className="w-28 text-left">Connector</StickyHeaderCell>
        <StickyHeaderCell className="w-28">Type</StickyHeaderCell>
        <StickyHeaderCell className="w-32">Ref. Client</StickyHeaderCell>
        <StickyHeaderCell className="w-32">Ref. DV</StickyHeaderCell>
        <StickyHeaderCell className="w-16">Color</StickyHeaderCell>
        <StickyHeaderCell className="w-16 text-center text-blue-300">
          Qty
        </StickyHeaderCell>
        <StickyHeaderCell className="w-16">Angle</StickyHeaderCell>
      </tr>
      {showFilters && (
        <FilterRow
          filters={filters}
          setFilterField={setFilterField}
          typeOptions={typeOptions}
          colorOptions={colorOptions}
        />
      )}
    </thead>
  );
};

export default TableHeader;
