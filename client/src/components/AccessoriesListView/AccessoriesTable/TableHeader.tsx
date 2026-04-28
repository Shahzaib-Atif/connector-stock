import React from "react";
import { AccessoryFilters } from "../constants";
import FilterRow from "./FilterRow";

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
        <th className="table-header-cell w-20">Photo</th>
        <th className="table-header-cell w-28">Name</th>
        <th className="table-header-cell w-28 text-left">Connector</th>
        <th className="table-header-cell w-28">Type</th>
        <th className="table-header-cell w-32">Ref. Client</th>
        <th className="table-header-cell w-32">Ref. DV</th>
        <th className="table-header-cell w-16">Color</th>
        <th className="table-header-cell w-16 text-center text-blue-300">
          Qty
        </th>
        <th className="table-header-cell w-16">Angle</th>
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
