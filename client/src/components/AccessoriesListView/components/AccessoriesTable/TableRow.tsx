import React from "react";
import { AccessoryApiResponse } from "@/types";
import { useNavigate } from "react-router-dom";

interface AccessoryListItem extends AccessoryApiResponse {
  id: string;
}

interface TableRowProps {
  accessory: AccessoryListItem;
  index: number;
}

const TableRow: React.FC<TableRowProps> = ({ accessory, index }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/accessory/${accessory.id}`);
  };

  return (
    <tr
      // onClick={handleClick}
      className={"table-row table-row-bg"}
    >
      <td className="table-data font-mono break-all">{accessory.id}</td>
      <td className="table-data">{accessory.ConnName || "-"}</td>
      <td className="table-data">{accessory.AccessoryType || "-"}</td>
      <td className="table-data break-all">{accessory.RefClient || "-"}</td>
      <td className="table-data break-all">{accessory.RefDV || "-"}</td>
      <td className="table-data">{accessory.CapotAngle || "-"}</td>
      <td className="table-data">{accessory.ClipColor || "-"}</td>
      <td className="table-data text-center text-emerald-200">
        {accessory.Qty ?? 0}
      </td>
    </tr>
  );
};

export default TableRow;
