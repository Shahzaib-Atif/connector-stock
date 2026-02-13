import React from "react";
import { FolderOpen } from "lucide-react";
import { useOpenFolder } from "@/hooks/useOpenFolder";
import { Sample } from "@/utils/types";
import { QRData } from "@/utils/types/shared";
import { Link } from "react-router-dom";
import { getConnectorId, getObservation } from "./utils";
import SamplesActionButtons from "./SamplesActionButtons";

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
    NumORC,
    Data_recepcao,
    qty_com_fio,
    qty_sem_fio,
    Observacoes,
    Entregue_a,
  } = sample;

  const { openFolder, isOpeningFolder } = useOpenFolder();

  return (
    <tr className={"table-row table-row-bg"} key={sample.ID}>
      <td className="table-data font-mono">{sample.ID}</td>
      <td className="table-data">{Cliente || "-"}</td>
      <td className="table-data break-all">{Projeto || "-"}</td>
      <td className="table-data">{EncDivmac || "-"}</td>
      <td className="table-data break-all">{Ref_Descricao || "-"}</td>
      <td className="table-data break-all">
        {Amostra ? (
          <Link
            to={`/connectors/${getConnectorId(Amostra)}`}
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            {Amostra}
          </Link>
        ) : (
          "-"
        )}
      </td>
      <td className="table-data break-all">{Quantidade || "-"}</td>
      <td className="table-data">
        <div className="flex items-center gap-2 justify-between">
          <span>{N_Envio || "-"}</span>
          {N_Envio && (
            <button
              onClick={() => openFolder(N_Envio)}
              disabled={isOpeningFolder}
              className={`text-slate-400 hover:text-blue-400 transition-colors ${
                isOpeningFolder ? "opacity-50 cursor-wait" : ""
              }`}
              title="Open Folder"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
      <td className="table-data">{NumORC || "-"}</td>
      <td className="table-data break-all" title={Entregue_a}>
        {Entregue_a || "-"}
      </td>
      <td className="table-data font-mono">{Data_recepcao || "-"}</td>
      <td className="table-data font-mono break-all">
        {getObservation(Observacoes ?? "", qty_com_fio, qty_sem_fio)}
      </td>
      {/* Action buttons */}
      {showActions && (
        <td className="table-data">
          <SamplesActionButtons
            sample={sample}
            onDelete={onDelete}
            onEdit={onEdit}
            onClone={onClone}
            onOpenQR={onOpenQR}
          />
        </td>
      )}
    </tr>
  );
};

export default TableRow;
