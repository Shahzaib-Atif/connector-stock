import React from "react";
import { Accessory } from "@/utils/types/types";

interface TableRowProps {
  accessory: Accessory;
  index: number;
}

const TableRow: React.FC<TableRowProps> = ({ accessory }) => {
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
