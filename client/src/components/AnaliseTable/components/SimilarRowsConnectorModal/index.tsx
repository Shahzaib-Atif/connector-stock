import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import ActionBtns from "./ActionBtns";
import SimilarRowsHeader from "./SimilarRowsHeader";
import SimilarRowsTable from "./SimilarRowsTable";

interface Props {
  sourceRow: AnaliseTabDto;
  newConnector: string;
  similarRows: AnaliseTabDto[];
  onApplyToAll: () => void;
  onOnlyThisRow: () => void;
  onClose: () => void;
}

// Confirms bulk connector rename for similar analise rows.
export default function SimilarRowsConnectorModal({
  sourceRow,
  newConnector,
  similarRows,
  onApplyToAll,
  onOnlyThisRow,
  onClose,
}: Props) {
  const totalCount = similarRows.length + 1;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <SimilarRowsHeader onClose={onClose} />

        <div className="px-6 py-4 space-y-4 overflow-y-auto">
          <p className="text-sm text-slate-300">
            Other lines have similar properties. Apply the connector name{" "}
            <span className="font-mono text-blue-300">{newConnector}</span> to
            all matching lines?
          </p>

          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-xs text-slate-400 space-y-1">
            <p>
              <span className="text-slate-500">Client Name:</span>{" "}
              {sourceRow.Cliente || "-"}
            </p>
            <p>
              <span className="text-slate-500">Order No:</span>{" "}
              {sourceRow.Encomenda || "-"}
            </p>
            <p>
              <span className="text-slate-500">Project Name:</span>{" "}
              {sourceRow.CDU_ProjetoCliente || "-"}
            </p>
          </div>

          <SimilarRowsTable similarRows={similarRows} sourceRow={sourceRow} />

          <p className="text-xs text-slate-500">
            Applying to all opens a short wizard: you click once per line to
            launch DIVDESK ({totalCount} steps).
          </p>
        </div>

        <ActionBtns
          onApplyToAll={onApplyToAll}
          onOnlyThisRow={onOnlyThisRow}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
