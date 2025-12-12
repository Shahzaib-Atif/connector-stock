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
      onClick={handleClick}
      className={`table-row cursor-pointer hover:bg-slate-700/50 ${
        index % 2 === 0 ? "bg-slate-800/30" : "bg-slate-800/10"
      }`}
    >
      <td className="table-cell font-mono font-semibold text-blue-400">
        {accessory.id}
      </td>
      <td className="table-cell text-slate-300">
        {accessory.ConnName || "-"}
      </td>
      <td className="table-cell text-slate-300">
        {accessory.AccessoryType || "-"}
      </td>
      <td className="table-cell text-slate-300 truncate">
        {accessory.RefClient || "-"}
      </td>
      <td className="table-cell text-slate-300 truncate">
        {accessory.RefDV || "-"}
      </td>
      <td className="table-cell text-slate-300">
        {accessory.CapotAngle || "-"}
      </td>
      <td className="table-cell text-slate-300">
        {accessory.ClipColor || "-"}
      </td>
      <td className="table-cell text-center font-semibold text-emerald-400">
        {accessory.Qty ?? 0}
      </td>
    </tr>
  );
};

export default TableRow;
