import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { AccessoryExtended } from "@/utils/types";

interface AccessoriesTableProps {
  accessories: AccessoryExtended[];
}

export const AccessoriesTable: React.FC<AccessoriesTableProps> = ({
  accessories,
}) => {
  return (
    <div id="accessories-table" className="table-container-inner">
      <table className="w-full table-fixed">
        <TableHeader />
        <tbody>
          {accessories.length === 0 ? (
            <tr>
              <td colSpan={9} className="table-row-not-found">
                No accessories found
              </td>
            </tr>
          ) : (
            accessories.map((accessory, index) => (
              <TableRow
                key={accessory.Id}
                accessory={accessory}
                index={index}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
