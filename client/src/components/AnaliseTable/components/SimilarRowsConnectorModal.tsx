import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import { GitBranch, X } from "lucide-react";

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
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Similar rows found</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4 overflow-y-auto">
          <p className="text-sm text-slate-300">
            Other lines share the same Encomenda, Estado, Cliente, and Projeto.
            Apply connector <span className="font-mono text-blue-300">{newConnector}</span> to
            all of them?
          </p>

          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-xs text-slate-400 space-y-1">
            <p>
              <span className="text-slate-500">Encomenda:</span> {sourceRow.Encomenda}
            </p>
            <p>
              <span className="text-slate-500">Estado:</span> {sourceRow.Estado || "-"}
            </p>
            <p>
              <span className="text-slate-500">Cliente:</span> {sourceRow.Cliente || "-"}
            </p>
            <p>
              <span className="text-slate-500">Projeto:</span>{" "}
              {sourceRow.CDU_ProjetoCliente || "-"}
            </p>
          </div>

          <div className="border border-slate-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/80 text-slate-400">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Linha</th>
                  <th className="px-3 py-2 text-left font-medium">Conector atual</th>
                  <th className="px-3 py-2 text-left font-medium">Descrição</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-700/80 bg-blue-500/10">
                  <td className="px-3 py-2 text-white">{sourceRow.NumLinha}</td>
                  <td className="px-3 py-2 text-slate-400 line-through">
                    {sourceRow.Conector || "-"}
                  </td>
                  <td className="px-3 py-2 text-slate-400 truncate max-w-[200px]">
                    {sourceRow.Descricao || "-"}
                  </td>
                </tr>
                {similarRows.map((row) => (
                  <tr
                    key={`${row.Encomenda}-${row.NumLinha}`}
                    className="border-t border-slate-700/80"
                  >
                    <td className="px-3 py-2 text-white">{row.NumLinha}</td>
                    <td className="px-3 py-2 text-amber-300">{row.Conector || "-"}</td>
                    <td className="px-3 py-2 text-slate-400 truncate max-w-[200px]">
                      {row.Descricao || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-500">
            Applying to all opens a short wizard: you click once per line to
            launch DIVDESK ({totalCount} steps).
          </p>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={onOnlyThisRow}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors"
          >
            Only this row
          </button>
          <button
            type="button"
            onClick={onApplyToAll}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Apply to all ({totalCount} clicks)
          </button>
        </div>
      </div>
    </div>
  );
}
