import { RegAmostrasEncRow } from "@/types/sampleCreation";
import { ArrowLeft, FileCheck, ImageIcon } from "lucide-react";
import { API } from "@/utils/api";
import { getConnectorId } from "@/utils/idUtils";
import { useState } from "react";

interface Props {
  regAmostrasData: RegAmostrasEncRow[];
  selectedRegRow: RegAmostrasEncRow | null;
  handleCreateRegister: () => void;
  selectRegRow: (row: RegAmostrasEncRow) => void;
  reset: () => void;
  goBack: () => void;
  error: string | null;
}

function WizardStep3({
  goBack,
  error,
  regAmostrasData,
  selectRegRow,
  selectedRegRow,
  handleCreateRegister,
}: Props) {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FileCheck className="w-5 h-5 mr-2" />
          Select Sample Register
        </h3>
        <button
          onClick={goBack}
          className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="mb-4 bg-slate-700/50 rounded-lg p-4 overflow-x-auto max-h-96">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-600">
            <tr className="text-slate-300">
              <th className="px-3 py-2 text-left"></th>
              <th className="px-3 py-2 text-left min-w-24">Picture</th>
              <th className="px-3 py-2 text-left">RefCliente</th>
              <th className="px-3 py-2 text-left min-w-32">Projeto</th>
              <th className="px-3 py-2 text-left">Amostra</th>
              <th className="px-5 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left min-w-32">Cliente</th>
              <th className="px-3 py-2 text-left">EncDivmac</th>
              <th className="px-3 py-2 text-left">Entregue_a</th>
              <th className="px-3 py-2 text-left">N_Envio</th>

              <th className="px-3 py-2 text-left">Data Pedido</th>
            </tr>
          </thead>
          <tbody>
            {regAmostrasData.map((row, idx) => {
              const connectorId = getConnectorId(
                row.CDU_ModuloRefConetorDV || ""
              );
              const hasError = imgErrors[connectorId];

              return (
                <tr
                  key={idx}
                  className={`border-b border-slate-700 hover:bg-slate-600/50 cursor-pointer ${
                    selectedRegRow === row ? "bg-blue-600/30" : ""
                  }`}
                  onClick={() => selectRegRow(row)}
                >
                  <td className="px-3 py-2">
                    <input
                      type="radio"
                      checked={
                        selectedRegRow.CDU_ModuloRefCliente ===
                          row.CDU_ModuloRefCliente &&
                        selectedRegRow.CDU_ModuloRefConetorDV ===
                          row.CDU_ModuloRefConetorDV
                      }
                      onChange={() => selectRegRow(row)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                      {!hasError ? (
                        <img
                          src={API.connectorImages(connectorId)}
                          alt={connectorId}
                          className="w-full h-full object-contain"
                          onError={() => handleImgError(connectorId)}
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-white">
                    {row.CDU_ModuloRefCliente}
                  </td>
                  <td className="px-3 py-2 text-white">
                    {row.CDU_ProjetoCliente}
                  </td>
                  <td className="px-3 py-2 text-white">
                    {row.CDU_ModuloRefConetorDV}
                  </td>
                  <td className="px-5 py-2 text-slate-300">{row.ID}</td>
                  <td className="px-3 py-2 text-slate-300">
                    {row.nome?.trim() || "-"}
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {row.cdu_projeto.trim() || "-"}
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {row.Entregue_a.trim() || "-"}
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {row.N_Envio.trim() || "-"}
                  </td>

                  <td className="px-3 py-2 text-slate-300">
                    {row.Data_do_pedido
                      ? (() => {
                          try {
                            const date = new Date(row.Data_do_pedido);
                            return !isNaN(date.getTime())
                              ? date.toLocaleDateString()
                              : "-";
                          } catch {
                            return "-";
                          }
                        })()
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCreateRegister}
          disabled={!selectedRegRow}
          className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Register
        </button>
      </div>
    </div>
  );
}

export default WizardStep3;
