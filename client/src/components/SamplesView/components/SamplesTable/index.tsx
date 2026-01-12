import React from "react";
import { QRData, Sample } from "@/utils/types";
import TableHeader from "./components/TableHeader";
import TableRow from "./components/TableRow";
import NoSamplesFound from "./components/NoSamplesFound";

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
      <table className="w-full table-fixed">
        <TableHeader showActions={showActions} />
        <tbody>
          {samples.length === 0 ? (
            <NoSamplesFound showActions={showActions} />
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
