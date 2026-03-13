import React from "react";

interface TableHeaderProps {
  showImages?: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({ showImages = false }) => {
  return (
    <thead className="table-header">
      <tr>
        {showImages && <th className="table-header-cell w-20">Photo</th>}
        <th className="table-header-cell w-28">ID</th>
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
