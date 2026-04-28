import React from "react";
import { ConnectorFilters } from "../constants";
import FilterRow from "./FilterRow";

interface TableHeaderProps {
  showImages?: boolean;
  showFilters?: boolean;
  filters: ConnectorFilters;
  setFilterField: (key: keyof ConnectorFilters, value: string) => void;
  typeOptions: string[];
  fabricanteOptions: string[];
  colorOptions: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({
  showImages = false,
  showFilters = false,
  filters,
  setFilterField,
  typeOptions,
  fabricanteOptions,
  colorOptions,
}) => {
  return (
    <thead className="table-header">
      {/* Header Row */}
      <tr>
        {showImages && <th className="table-header-cell w-24">Photo</th>}
        <th className="table-header-cell w-28">Codivmac Id</th>
        <th className="table-header-cell w-24">Position</th>
        <th className="table-header-cell w-20">Color</th>
        <th className="table-header-cell w-20">Vias</th>
        <th className="table-header-cell w-24">Type</th>
        <th className="table-header-cell w-20">Family</th>
        <th className="table-header-cell w-32">Fabricante</th>
        <th className="table-header-cell w-32">Ref. Fabricante</th>
        <th className="table-header-cell w-32">Dimensions (mm)</th>
        <th className="table-header-cell w-20 text-center text-blue-300">
          Total
        </th>
        <th className="table-header-cell w-16 text-center text-slate-400">
          CF
        </th>
        <th className="table-header-cell w-16 text-center text-slate-400">
          SF
        </th>
        <th className="table-header-cell w-32">OBS</th>
      </tr>
      {/* Filter Row */}
      {showFilters && (
        <FilterRow
          showImages={showImages}
          colorOptions={colorOptions}
          fabricanteOptions={fabricanteOptions}
          typeOptions={typeOptions}
          filters={filters}
          setFilterField={setFilterField}
        />
      )}
    </thead>
  );
};

export default TableHeader;
