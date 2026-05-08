import React from "react";
import { ConnectorFilters } from "../constants";
import FilterRow from "./FilterRow";
import { StickyHeaderCell } from "@/components/common/TableFilters";

interface TableHeaderProps {
  showImages?: boolean;
  showFilters?: boolean;
  filters: ConnectorFilters;
  setFilterField: (key: keyof ConnectorFilters, value: string) => void;
  typeOptions: string[];
  fabricanteOptions: string[];
  colorOptions: string[];
  isLegacyMode?: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  showImages = false,
  showFilters = false,
  isLegacyMode = false,
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
        {showImages && (
          <StickyHeaderCell className="w-24">Photo</StickyHeaderCell>
        )}
        <StickyHeaderCell className="w-28">Codivmac Id</StickyHeaderCell>
        <StickyHeaderCell className="w-24">Position</StickyHeaderCell>
        <StickyHeaderCell className="w-20">Color</StickyHeaderCell>
        <StickyHeaderCell className="w-20">Vias</StickyHeaderCell>
        <StickyHeaderCell className="w-32">Type</StickyHeaderCell>
        {!isLegacyMode && (
          <StickyHeaderCell className="w-20">Family</StickyHeaderCell>
        )}
        <StickyHeaderCell className="w-32">Fabricante</StickyHeaderCell>
        <StickyHeaderCell className="w-32">Ref. Fabricante</StickyHeaderCell>
        {!isLegacyMode && (
          <StickyHeaderCell className="w-32">Dimensions (mm)</StickyHeaderCell>
        )}
        <StickyHeaderCell className="w-20 text-center text-blue-300">
          Total
        </StickyHeaderCell>
        <StickyHeaderCell className="w-16 text-center text-slate-400">
          CF
        </StickyHeaderCell>
        <StickyHeaderCell className="w-16 text-center text-slate-400">
          SF
        </StickyHeaderCell>
        <StickyHeaderCell className="w-32">OBS</StickyHeaderCell>
      </tr>
      {/* Filter Row */}
      {showFilters && (
        <FilterRow
          isLegacyMode={isLegacyMode}
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
