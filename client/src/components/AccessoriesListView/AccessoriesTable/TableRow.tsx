import React from "react";
import { Accessory } from "@/utils/types";
import { getConnectorId } from "@/utils/idUtils";
import { Link } from "react-router-dom";
import { API } from "@/utils/api";
import { ROUTES } from "@/components/AppRoutes";

interface TableRowProps {
  accessory: Accessory;
  index: number;
  showImages?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({
  accessory,
  showImages = false,
}) => {
  const getLink = (itemType: "connector" | "accessory", itemId: string) => {
    switch (itemType) {
      case "connector":
        // take to connector or box
        itemId = getConnectorId(itemId);
        if (itemId.length === 4) return `${ROUTES.BOXES}/${itemId}`;
        else return `${ROUTES.CONNECTORS}/${itemId}`;
      case "accessory":
        return `${ROUTES.ACCESSORIES}/${itemId}`;
      default:
        return "#";
    }
  };

  const imageUrl = API.accessoryImages(accessory.id);

  return (
    <tr className={"table-row table-row-bg"}>
      {showImages && (
        <td className="table-data py-2 px-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-slate-700 overflow-hidden bg-slate-900 flex items-center justify-center shrink-0 shadow-inner">
            <img
              src={imageUrl}
              alt={accessory.id}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              onError={(e) => {
                // Fallback to Icon if image fails to load
                (e.target as HTMLImageElement).parentElement!.innerHTML =
                  '<div class="text-slate-600 flex items-center justify-center w-full h-full bg-slate-800/50"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image opacity-20"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
              }}
            />
          </div>
        </td>
      )}
      <td className="table-data font-mono break-all">
        <Link to={getLink("accessory", accessory.id)} className="link-btn">
          {accessory.id || "-"}
        </Link>
      </td>
      <td className="table-data">
        <Link
          to={getLink("connector", accessory.ConnName)}
          className="link-btn"
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
