import React from "react";
import { ConnectorReferenceApiResponse } from "@/types";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

interface ConnectorListItem extends ConnectorReferenceApiResponse {
  id: string;
}

interface ConnectorsTableProps {
  connectors: ConnectorListItem[];
}

export const ConnectorsTable: React.FC<ConnectorsTableProps> = ({
  connectors,
}) => {
  return (
    <div id="connectors-table" className="table-container-inner">
      <table className="w-full table-fixed">
        <TableHeader />
        <tbody>
          {connectors.length === 0 ? (
            <tr>
              <td colSpan={8} className="table-row-not-found">
                No connectors found
              </td>
            </tr>
          ) : (
            connectors.map((connector, index) => (
              <TableRow
                key={connector.id}
                connector={connector}
                index={index}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
