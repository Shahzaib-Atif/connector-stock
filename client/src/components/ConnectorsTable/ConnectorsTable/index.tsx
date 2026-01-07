import React from "react";
import { ConnectorReferenceApiResponse } from "@/utils/types/types";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

interface ConnectorListItem extends ConnectorReferenceApiResponse {
  id: string;
}

interface ConnectorsTableProps {
  connectors: ConnectorListItem[];
  showImages?: boolean;
}

export const ConnectorsTable: React.FC<ConnectorsTableProps> = ({
  connectors,
  showImages = false,
}) => {
  return (
    <div id="connectors-table" className="table-container-inner">
      <table className="w-full table-fixed">
        <TableHeader showImages={showImages} />
        <tbody>
          {connectors.length === 0 ? (
            <tr>
              <td colSpan={showImages ? 9 : 8} className="table-row-not-found">
                No connectors found
              </td>
            </tr>
          ) : (
            connectors.map((connector, index) => (
              <TableRow
                key={connector.id}
                connector={connector}
                index={index}
                showImages={showImages}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
