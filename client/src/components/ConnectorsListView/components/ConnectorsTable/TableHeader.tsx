import React from "react";

const TableHeader: React.FC = () => {
  return (
    <thead className="table-header">
      <tr>
        <th className="table-header-cell w-20">ID</th>
        <th className="table-header-cell w-20">Position</th>
        <th className="table-header-cell w-20">Color</th>
        <th className="table-header-cell w-20">Vias</th>
        <th className="table-header-cell w-24">Type</th>
        <th className="table-header-cell w-32">Fabricante</th>
        <th className="table-header-cell w-32">Ref. Fabricante</th>
        <th className="table-header-cell w-20 text-center">Stock</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
