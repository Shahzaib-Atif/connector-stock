import React from "react";

interface TableHeaderProps {
  showImages?: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({ showImages = false }) => {
  return (
    <thead className="table-header">
      <tr>
        {showImages && <th className="table-header-cell w-24">Photo</th>}
        <th className="table-header-cell w-28">ID</th>
        <th className="table-header-cell w-24">Position</th>
        <th className="table-header-cell w-16">Color</th>
        <th className="table-header-cell w-16">Vias</th>
        <th className="table-header-cell w-24">Type</th>
        <th className="table-header-cell w-16">Family</th>
        <th className="table-header-cell w-32">Fabricante</th>
        <th className="table-header-cell w-32">Ref. Fabricante</th>
        <th className="table-header-cell w-20 text-center">Stock</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
