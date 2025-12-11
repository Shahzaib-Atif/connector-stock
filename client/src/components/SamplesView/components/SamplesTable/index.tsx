import React from "react";
import { Sample } from "@/types";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

interface SamplesTableProps {
  samples: Sample[];
  onEdit: (sample: Sample) => void;
  onDelete: (sample: Sample) => void;
}

export const SamplesTable: React.FC<SamplesTableProps> = ({
  samples,
  onEdit,
  onDelete,
}) => {
  return (
    <div id="samples-table" className="table-container">
      <table className="w-full text-sm table-fixed">
        <TableHeader />
        <tbody>
          {samples.length === 0 ? (
            <tr>
              <td colSpan={10} className="table-row-not-found">
                No samples found
              </td>
            </tr>
          ) : (
            samples.map((sample, index) => (
              <TableRow
                key={sample.ID}
                sample={sample}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
