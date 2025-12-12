import React from "react";
import { ConnectorReferenceApiResponse } from "@/types";
import { useNavigate } from "react-router-dom";

interface ConnectorListItem extends ConnectorReferenceApiResponse {
  id: string;
}

interface TableRowProps {
  connector: ConnectorListItem;
  index: number;
}

const TableRow: React.FC<TableRowProps> = ({ connector, index }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/connector/${connector.id}`);
  };

  return (
    <tr
      onClick={handleClick}
      className={`table-row cursor-pointer hover:bg-slate-700/50 ${
        index % 2 === 0 ? "bg-slate-800/30" : "bg-slate-800/10"
      }`}
    >
      <td className="table-cell font-mono font-semibold text-blue-400">
        {connector.id}
      </td>
      <td className="table-cell text-slate-300">
        {connector.Pos_ID || "-"}
      </td>
      <td className="table-cell text-slate-300">
        {connector.Cor || "-"}
      </td>
      <td className="table-cell text-slate-300">
        {connector.Vias || "-"}
      </td>
      <td className="table-cell text-slate-300">
        {connector.ConnType || "-"}
      </td>
      <td className="table-cell text-slate-300">
        {connector.Fabricante || "-"}
      </td>
      <td className="table-cell text-slate-300 truncate">
        {connector.Refabricante || "-"}
      </td>
      <td className="table-cell text-center font-semibold text-emerald-400">
        {connector.Qty ?? 0}
      </td>
    </tr>
  );
};

export default TableRow;
