import React from "react";
import { ConnectorReferenceApiResponse } from "@/types";
import { ExternalLink, ImageIcon } from "lucide-react";
import { API } from "@/utils/api";
import { ROUTES } from "@/components/AppRoutes";

interface ConnectorListItem extends ConnectorReferenceApiResponse {
  id: string;
}

interface TableRowProps {
  connector: ConnectorListItem;
  index: number;
  showImages?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({
  connector,
  showImages = false,
}) => {
  const handleOpenLink = (id: string, type: "box" | "connector") => {
    const route = type === "connector" ? ROUTES.CONNECTORS : ROUTES.BOXES;
    const url = `${route}/${id}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const imageUrl = API.connectorImages(connector.CODIVMAC);

  return (
    <tr className={"table-row table-row-bg"} key={connector.id}>
      {/* Photo */}
      {showImages && (
        <td className="table-data py-2 px-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-slate-700 overflow-hidden bg-slate-900 flex items-center justify-center shrink-0 shadow-inner">
            <img
              src={imageUrl}
              alt={connector.CODIVMAC}
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
      {/* ID */}
      <td className="table-data">
        {" "}
        <div className="flex items-center gap-1 sm:gap-2">
          <span>{connector.CODIVMAC}</span>
          <button
            onClick={() => handleOpenLink(connector.CODIVMAC, "connector")}
            className="text-slate-400 hover:text-blue-400 transition-colors p-1"
            title={`Open ${connector.CODIVMAC} in new tab`}
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </td>

      {/* PosId */}
      <td className="table-data">
        {" "}
        <div className="flex items-center gap-1 sm:gap-2">
          <span>{connector.PosId}</span>
          {connector.PosId && (
            <button
              onClick={() => handleOpenLink(connector.PosId, "box")}
              className="text-slate-400 hover:text-blue-400 transition-colors p-1"
              title={`Open ${connector.PosId} in new tab`}
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>

      {/* Other Fields */}
      <td className="table-data">{connector.Cor || "-"}</td>
      <td className="table-data">{connector.Vias || "-"}</td>
      <td className="table-data">{connector.ConnType || "-"}</td>
      <td className="table-data text-center">{connector.Family || "-"}</td>
      <td className="table-data">{connector.Fabricante || "-"}</td>
      <td className="table-data break-all">{connector.Refabricante || "-"}</td>
      <td className="table-data text-center text-emerald-200">
        {connector.Qty ?? 0}
      </td>
    </tr>
  );
};

export default TableRow;
