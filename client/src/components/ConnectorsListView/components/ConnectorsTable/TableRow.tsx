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
    <tr className={"table-row table-row-bg"} key={connector.id}>
      <td className="table-data font-mono">{connector.id}</td>
      <td className="table-data">{connector.Pos_ID || "-"}</td>
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
