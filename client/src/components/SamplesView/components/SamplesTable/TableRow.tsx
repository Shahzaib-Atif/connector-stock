import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Sample } from "@/types";

interface TableRowProps {
  sample: Sample;
  index: number;
  onEdit: (sample: Sample) => void;
  onDelete: (sample: Sample) => void;
}

const TableRow: React.FC<TableRowProps> = ({
  sample,
  index,
  onEdit,
  onDelete,
}) => {
  const rowBg = index % 2 === 0 ? "bg-slate-800/30" : "bg-slate-800/10";
  const {
    Cliente,
    Projeto,
    EncDivmac,
    Ref_Descricao,
    Amostra,
    N_Envio,
    Data_recepcao,
    Entregue_a,
  } = sample;

  return (
    <tr className={`${rowBg} hover:bg-slate-700/50 transition-colors`}>
      <td className="table-data font-mono text-slate-300">{sample.ID}</td>
      <td className="table-data">{Cliente || "-"}</td>
      <td className="table-data">{Projeto || "-"}</td>
      <td className="table-data font-mono">{EncDivmac || "-"}</td>
      <td className="table-data break-all">{Ref_Descricao || "-"}</td>
      <td className="table-data font-mono">{Amostra || "-"}</td>
      <td className="table-data text-slate-400">{N_Envio || "-"}</td>
      <td className="table-data text-slate-400">{Data_recepcao || "-"}</td>
      <td className="table-data text-ellipsis overflow-clip" title={Entregue_a}>
        {Entregue_a || "-"}
      </td>
      <td className="table-data">
        <div className="flex justify-center gap-2">
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
    </tr>
  );
};

export default TableRow;
