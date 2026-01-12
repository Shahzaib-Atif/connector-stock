import React from "react";
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
      <td className="table-data break-all">
        {Amostra ? (
          <Link
            to={`/connectors/${getConnectorId(Amostra)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            {Amostra}
          </Link>
        ) : (
          "-"
        )}
      </td>
      <td className="table-data break-all">{Quantidade || "-"}</td>
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
