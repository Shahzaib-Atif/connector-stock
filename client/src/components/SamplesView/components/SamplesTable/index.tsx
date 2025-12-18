import React from "react";
import { QRData, Sample } from "@/types";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

interface SamplesTableProps {
  samples: Sample[];
  onEdit: (sample: Sample) => void;
  onDelete: (sample: Sample) => void;
  onOpenQR?: (qrData: QRData) => void;
  onClone?: (sample: Sample) => void;
  showActions?: boolean;
}

export const SamplesTable: React.FC<SamplesTableProps> = ({
  samples,
  onEdit,
  onDelete,
  onOpenQR,
  onClone,
  showActions = true,
}) => {
  return (
    <div id="samples-table" className="table-container-inner">
      <table className="w-full text-sm table-fixed">
        <TableHeader showActions={showActions} />
        <tbody>
          {samples.length === 0 ? (
            <tr>
              <td colSpan={showActions ? 10 : 9} className="table-row-not-found">
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
                onOpenQR={onOpenQR}
                onClone={onClone}
                showActions={showActions}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
