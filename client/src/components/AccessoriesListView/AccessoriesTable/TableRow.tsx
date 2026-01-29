import React from "react";
import { Accessory } from "@/utils/types";
import { getConnectorId } from "@/utils/idUtils";
import { Link } from "react-router-dom";
import { ROUTES } from "@/components/AppRoutes";

interface TableRowProps {
  accessory: Accessory;
  index: number;
}

const TableRow: React.FC<TableRowProps> = ({ accessory }) => {
  const getLink = (itemType: "connector" | "accessory", itemId: string) => {
    switch (itemType) {
      case "connector":
        itemId = getConnectorId(itemId);
        return `${ROUTES.CONNECTORS}/${itemId}`;
      case "accessory":
        return `${ROUTES.ACCESSORIES}/${itemId}`;
        break;
      default:
        return "#";
    }
  };

  return (
    <tr className={"table-row table-row-bg"}>
      <td className="table-data font-mono break-all">
        <Link
          to={getLink("accessory", accessory.id)}
          className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
        >
          {accessory.id || "-"}
        </Link>
      </td>
      <td className="table-data">
        <Link
          to={getLink("connector", accessory.ConnName)}
          className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
        >
          {accessory.ConnName || "-"}
        </Link>
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
