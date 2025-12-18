import React from "react";
import { ConnectorReferenceApiResponse } from "@/types";
import { ExternalLink } from "lucide-react";

interface ConnectorListItem extends ConnectorReferenceApiResponse {
  id: string;
}

interface TableRowProps {
  connector: ConnectorListItem;
  index: number;
}

const TableRow: React.FC<TableRowProps> = ({ connector }) => {
  const handleOpenLink = (id: string, type: "box" | "connector") => {
    const url = `/${type}/${id}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <tr className={"table-row table-row-bg"} key={connector.id}>
      {/* ID */}
      <td className="table-data">
        {" "}
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
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
      <td className="table-data">{connector.Fabricante || "-"}</td>
      <td className="table-data break-all">{connector.Refabricante || "-"}</td>
      <td className="table-data text-center text-emerald-200">
        {connector.Qty ?? 0}
      </td>
    </tr>
  );
};

export default TableRow;
