import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { Connector } from "@/utils/types";

interface ConnectorsTableProps {
  connectors: Connector[];
  showImages?: boolean;
  isLegacyMode?: boolean;
}

export const ConnectorsTable: React.FC<ConnectorsTableProps> = ({
  connectors,
  showImages = false,
  isLegacyMode = false,
}) => {
  return (
    <div id="connectors-table" className="table-container-inner">
      <table className="w-full table-fixed">
        <TableHeader showImages={showImages} />
        <tbody>
          {connectors.length === 0 ? (
            <tr>
              <td colSpan={showImages ? 13 : 12} className="table-row-not-found">
                No connectors found
              </td>
            </tr>
          ) : (
            connectors.map((connector) => (
              <TableRow
                key={connector.CODIVMAC}
                connector={connector}
                showImages={showImages}
                isLegacyMode={isLegacyMode}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
