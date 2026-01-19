import { RegAmostrasOrcRow } from "@/types/sampleCreation";
import { API } from "@/utils/api";
import { ImageIcon } from "lucide-react";

interface Props {
  row: RegAmostrasOrcRow;
  connectorId: string;
  selectedRegRow: RegAmostrasOrcRow;
  selectRegRow: (row: RegAmostrasOrcRow) => void;
  hasError?: boolean;
  handleImgError: (id: string) => void;
}

function DataRow({
  row,
  connectorId,
  selectedRegRow,
  selectRegRow,
  hasError,
  handleImgError,
}: Props) {
  const refCliente = row.CDU_ModuloRefCliente;
  const conector = row.CDU_ModuloRefConetorDV;
  const projeto = row.CDU_ProjetoCliente;
  const orc = row.orcDoc;
  const clientName = row.Nome;

  return (
    <tr
      className={`border-b border-slate-700 hover:bg-slate-600/50 cursor-pointer ${
        selectedRegRow === row ? "bg-blue-600/30" : ""
      }`}
      onClick={() => selectRegRow(row)}
    >
      <td className="px-3 py-2">
        <input
          type="radio"
          checked={
            selectedRegRow?.CDU_ModuloRefCliente === row.CDU_ModuloRefCliente &&
            selectedRegRow?.CDU_ModuloRefConetorDV ===
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
      <td className="px-3 py-2 text-white">{refCliente}</td>
      <td className="px-3 py-2 text-white">{projeto}</td>
      <td className="px-3 py-2 text-white">{conector}</td>
      <td className="px-5 py-2 text-slate-300">{row.ID}</td>
      <td className="px-3 py-2 text-slate-300">{clientName?.trim() || "-"}</td>
      <td className="px-3 py-2 text-slate-300">{orc?.trim() || "-"}</td>
      <td className="px-3 py-2 text-slate-300">
        {row.Entregue_a?.trim() || "-"}
      </td>
      <td className="px-3 py-2 text-slate-300">{row.N_Envio?.trim() || "-"}</td>

      <td className="px-3 py-2 text-slate-300">
        {row.Data_do_pedido
          ? (() => {
              try {
                const date = new Date(row.Data_do_pedido);
                return !isNaN(date.getTime()) ? date.toLocaleDateString() : "-";
              } catch {
                return "-";
              }
            })()
          : "-"}
      </td>
    </tr>
  );
}

export default DataRow;
