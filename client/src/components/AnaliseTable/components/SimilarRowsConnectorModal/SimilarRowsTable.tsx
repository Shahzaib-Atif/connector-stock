import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import SingleRow from "./SingleRow";

interface Props {
  sourceRow: AnaliseTabDto;
  similarRows: AnaliseTabDto[];
}

export default function SimilarRowsTable({ sourceRow, similarRows }: Props) {
  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        {/* Table Header */}
        <thead className="bg-slate-800/80 text-slate-400">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Line No.</th>
            <th className="px-3 py-2 text-left font-medium">
              Actual Connector
            </th>
            <th className="px-3 py-2 text-left font-medium">Ref. Client</th>
            <th className="px-3 py-2 text-left font-medium">Status</th>
            <th className="px-3 py-2 text-left font-medium">Description</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {/* source row */}
          <SingleRow row={sourceRow} sourceRow={true} />

          {/* similar rows */}
          {similarRows.map((row) => (
            <SingleRow
              key={`${row.Encomenda}-${row.NumLinha}`}
              row={row}
              sourceRow={false}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
