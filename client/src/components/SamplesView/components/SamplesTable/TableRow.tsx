import React from "react";
import { Pencil, Trash2, Printer } from "lucide-react";
import { Sample } from "@/utils/types";
import { QRData } from "@/utils/types/shared";

interface TableRowProps {
  sample: Sample;
  index: number;
  onEdit: (sample: Sample) => void;
  onDelete: (sample: Sample) => void;
  onOpenQR?: (qrData: QRData) => void;
  onClone?: (sample: Sample) => void;
  showActions?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({
  sample,
  onEdit,
  onDelete,
  onOpenQR,
  onClone,
  showActions = true,
}) => {
  const {
    Cliente,
    Projeto,
    EncDivmac,
    Ref_Descricao,
    Amostra,
    Quantidade,
    N_Envio,
    Data_recepcao,
    com_fio,
    Observacoes,
    Entregue_a,
  } = sample;

  return (
    <tr className={"table-row table-row-bg"} key={sample.ID}>
      <td className="table-data font-mono">{sample.ID}</td>
      <td className="table-data">{Cliente || "-"}</td>
      <td className="table-data break-all">{Projeto || "-"}</td>
      <td className="table-data">{EncDivmac || "-"}</td>
      <td className="table-data break-all">{Ref_Descricao || "-"}</td>
      <td className="table-data break-all">{Amostra || "-"}</td>
      <td className="table-data">{Quantidade || "-"}</td>
      <td className="table-data">{N_Envio || "-"}</td>
      <td className="table-data break-all" title={Entregue_a}>
        {Entregue_a || "-"}
      </td>
      <td className="table-data font-mono">{Data_recepcao || "-"}</td>
      <td className="table-data font-mono">
        {getObservation(Observacoes, com_fio)}
      </td>
      {/* Action buttons */}
      {showActions && (
        <td className="table-data">
          <div className="flex justify-center gap-2">
            {onOpenQR && (
              <button
                onClick={() =>
                  onOpenQR({
                    id: Amostra,
                    source: "sample",
                    refCliente: Ref_Descricao,
                    encomenda: EncDivmac,
                    qty: Quantidade ? parseInt(Quantidade) : undefined,
                  })
                }
                title="Print Label"
                className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-slate-700 rounded transition-colors"
              >
                <Printer className="w-4 h-4" />
              </button>
            )}
            {onClone && (
              <button
                onClick={() => onClone(sample)}
                title="Duplicate"
                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded transition-colors"
              >
                ⧉
              </button>
            )}
            <button
              onClick={() => onEdit(sample)}
              title="Edit"
              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(sample)}
              title="Delete"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};

function getObservation(Observacoes: string, com_fio: boolean) {
  let obs = com_fio ? "c/fio" : "s/fio";
  if (Observacoes && Observacoes.trim() !== "") obs += ` - ${Observacoes}`;

  return obs;
}

export default TableRow;
