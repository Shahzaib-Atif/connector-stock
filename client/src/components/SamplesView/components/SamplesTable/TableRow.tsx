import React from "react";
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

  return (
    <tr className={`${rowBg} hover:bg-slate-700/50 transition-colors`}>
      <td className="table-data font-mono text-slate-300">{sample.ID}</td>
      <td className="table-data">{sample.Cliente || "-"}</td>
      <td className="table-data">{sample.Projeto || "-"}</td>
      <td className="table-data font-mono">{sample.EncDivmac || "-"}</td>
      <td className="table-data">{sample.Ref_Descricao || "-"}</td>
      <td className="table-data font-mono">{sample.Amostra || "-"}</td>
      <td className="table-data text-slate-400">
        {sample.Data_do_pedido || "-"}
      </td>
      <td className="table-data text-slate-400">
        {sample.Data_recepcao || "-"}
      </td>
      <td className="table-data">{sample.Entregue_a || "-"}</td>
      <td className="table-data">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onEdit(sample)}
            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(sample)}
            className="px-3 py-1 text-xs bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
