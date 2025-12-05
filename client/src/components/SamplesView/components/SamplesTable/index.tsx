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
    <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50">
      <table className="w-full text-sm table-fixed">
        <TableHeader />
        <tbody>
          {samples.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-4 py-8 text-center text-slate-400">
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
