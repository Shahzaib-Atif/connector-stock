import React from "react";
import { SampleFilters } from "../../../constants";
import FilterRow from "./FilterRow";

interface TableHeaderProps {
  showActions?: boolean;
  showFilters?: boolean;
  filters: SampleFilters;
  setFilterField: (key: keyof SampleFilters, value: string) => void;
  entregueOptions: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({
  showActions = true,
  showFilters = false,
  filters,
  setFilterField,
  // entregueOptions,
}) => {
  return (
    <thead className="table-header">
      {/* Header Row */}
      <tr>
        <th className="table-header-cell w-16">ID</th>
        <th className="table-header-cell w-48">Cliente</th>
        <th className="table-header-cell w-48">Projeto</th>
        <th className="table-header-cell w-32">EncDivmac</th>
        <th className="table-header-cell w-40">Ref. Descrição</th>
        <th className="table-header-cell w-40">Amostra</th>
        <th className="table-header-cell w-32">NumORC</th>
        <th className="table-header-cell w-48">N_Envio</th>
        <th className="table-header-cell">Entregue_A</th>
        <th className="table-header-cell w-24">Qty.</th>
        <th className="table-header-cell">Data Receção</th>
        <th className="table-header-cell w-36">Observacoes</th>
        {showActions && (
          <th className="table-header-cell text-center">Actions</th>
        )}
      </tr>
      {/* Filter Row */}
      {showFilters && (
        <FilterRow filters={filters} setFilterField={setFilterField} />
      )}
    </thead>
  );
};

export default TableHeader;
