import React from "react";
import { API } from "@/utils/api";
import { ROUTES } from "@/components/AppRoutes";
import { Connector } from "@/utils/types";
import { Link } from "react-router-dom";
import { Link as LinkIcon } from "lucide-react";

interface TableRowProps {
  connector: Connector;
  showImages?: boolean;
  isLegacyMode?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({
  connector,
  showImages = false,
  isLegacyMode = false,
}) => {
  const getLink = (id: string, type: "box" | "connector") => {
    const route = type === "connector" ? ROUTES.CONNECTORS : ROUTES.BOXES;
    const url = `${route}/${id}`;
    return url;
  };

  const imageUrl = API.connectorImages(connector.CODIVMAC);

  return (
    <tr className={"table-row table-row-bg"} key={connector.CODIVMAC}>
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
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span>{connector.CODIVMAC}</span>
          {!isLegacyMode && (
            <Link
              to={getLink(connector.CODIVMAC, "connector")}
              className="text-slate-400 hover:text-blue-400 transition-colors p-1"
            >
              <LinkIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
      </td>

      {/* PosId */}
      <td className="table-data">
        {" "}
        <div className="flex items-center gap-1">
          <span>{connector.PosId}</span>
          {connector.PosId && (
            <Link
              to={getLink(connector.PosId, "box")}
              className="text-slate-400 hover:text-blue-400 transition-colors p-1"
            >
              <LinkIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
      </td>

      {/* Other Fields */}
      <td className="table-data">{connector.Cor || "-"}</td>
      <td className="table-data">{connector.Vias || "-"}</td>
      <td className="table-data">{connector.ConnType || "-"}</td>
      <td className="table-data text-center">
        {connector.details.Family || "-"}
      </td>
      <td className="table-data">{connector.details.Fabricante || "-"}</td>
      <td className="table-data break-all">
        {connector.details.Refabricante || "-"}
      </td>
      <td className="table-data break-all">{connector.details.OBS || "-"}</td>
      <td className="table-data text-center">
        <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2 py-0.5 rounded-md">
          {connector.Qty ?? 0}
        </span>
      </td>
      <td className="table-data text-center">
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1 group">
            <div className="w-1 h-1 rounded-full bg-blue-400 opacity-60" />
            <span className="text-slate-400 text-sm font-mono">
              {connector.Qty_com_fio ?? 0}
            </span>
          </div>
        </div>
      </td>
      <td className="table-data text-center">
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1 group">
            <div className="w-1 h-1 rounded-full bg-slate-500 opacity-60" />
            <span className="text-slate-500 text-sm font-mono">
              {connector.Qty_sem_fio ?? 0}
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
