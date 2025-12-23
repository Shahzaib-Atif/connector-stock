import React from "react";

const TableHeader: React.FC = () => {
  return (
    <thead className="table-header">
      <tr>
        <th className="table-header-cell w-40">ID</th>
        <th className="table-header-cell w-28">Connector</th>
        <th className="table-header-cell w-32">Type</th>
        <th className="table-header-cell w-40">Ref. Client</th>
        <th className="table-header-cell w-40">Ref. DV</th>
        <th className="table-header-cell w-24">Capot Angle</th>
        <th className="table-header-cell w-24">Clip Color</th>
        <th className="table-header-cell w-20 text-center">Stock</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
