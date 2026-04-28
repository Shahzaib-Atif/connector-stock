import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { ConnectorExtended } from "@/utils/types";
import { ConnectorFilters } from "../constants";

interface ConnectorsTableProps {
  connectors: ConnectorExtended[];
  showImages?: boolean;
  isLegacyMode?: boolean;
  showFilters?: boolean;
  filters: ConnectorFilters;
  setFilterField: (key: keyof ConnectorFilters, value: string) => void;
  typeOptions: string[];
  fabricanteOptions: string[];
  colorOptions: string[];
}

export const ConnectorsTable: React.FC<ConnectorsTableProps> = ({
  connectors,
  showImages = false,
  isLegacyMode = false,
  showFilters = false,
  filters,
  setFilterField,
  typeOptions,
  fabricanteOptions,
  colorOptions,
}) => {
  return (
    <div id="connectors-table" className="table-container-inner">
      <table className="w-full table-fixed">
        <TableHeader
          showImages={showImages}
          showFilters={showFilters}
          filters={filters}
          setFilterField={setFilterField}
          typeOptions={typeOptions}
          fabricanteOptions={fabricanteOptions}
          colorOptions={colorOptions}
        />
        <tbody>
          {connectors.length === 0 ? (
            <tr>
              <td
                colSpan={showImages ? 14 : 13}
                className="table-row-not-found"
              >
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
