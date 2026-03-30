import React from "react";

const TableHeader: React.FC = () => {
  return (
    <thead className="table-header">
      <tr>
        <th className="table-header-cell w-20">Photo</th>
        <th className="table-header-cell w-28">Name</th>
        <th className="table-header-cell w-28 text-left">Connector</th>
        <th className="table-header-cell w-28">Type</th>
        <th className="table-header-cell w-32">Ref. Client</th>
        <th className="table-header-cell w-32">Ref. DV</th>
        <th className="table-header-cell w-16">Angle</th>
        <th className="table-header-cell w-16">Color</th>
        <th className="table-header-cell w-16 text-center text-blue-300">
          Qty
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
