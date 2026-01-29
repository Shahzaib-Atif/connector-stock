import React from "react";
import { Accessory } from "@/utils/types";
import { getConnectorId } from "@/utils/idUtils";
import { Link } from "react-router-dom";

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
      <td className="table-data">
        {accessory.ConnName ? (
          <Link
            to={`/connectors/${getConnectorId(accessory.ConnName)}`}
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            {accessory.ConnName || "-"}
          </Link>
        ) : (
          "-"
        )}
      </td>
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
