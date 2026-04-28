import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { AccessoryExtended } from "@/utils/types";
import { AccessoryFilters } from "../constants";

interface AccessoriesTableProps {
  accessories: AccessoryExtended[];
  showFilters?: boolean;
  filters: AccessoryFilters;
  setFilterField: (key: keyof AccessoryFilters, value: string) => void;
  typeOptions: string[];
  colorOptions: string[];
}

export const AccessoriesTable: React.FC<AccessoriesTableProps> = ({
  accessories,
  showFilters = false,
  filters,
  setFilterField,
  typeOptions,
  colorOptions,
}) => {
  return (
    <div id="accessories-table" className="table-container-inner">
      <table className="w-full table-fixed">
        <TableHeader
          showFilters={showFilters}
          filters={filters}
          setFilterField={setFilterField}
          typeOptions={typeOptions}
          colorOptions={colorOptions}
        />
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
