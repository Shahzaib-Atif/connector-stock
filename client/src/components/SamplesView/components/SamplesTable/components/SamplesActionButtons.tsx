import { Printer, Pencil, Trash2 } from "lucide-react";
import { QRData } from "@/utils/types";
import { btnClass1 } from "./utils";
import { SamplesDto } from "@shared/dto/SamplesDto";

interface Props {
  sample: SamplesDto;
  onEdit: (sample: SamplesDto) => void;
  onDelete: (sample: SamplesDto) => void;
  onOpenQR?: (qrData: QRData) => void;
  onClone?: (sample: SamplesDto) => void;
}

function SamplesActionButtons({
  sample,
  onOpenQR,
  onClone,
  onEdit,
  onDelete,
}: Props) {
  const { EncDivmac, Ref_Descricao, Amostra, Quantidade } = sample;

  return (
    <div className="flex justify-center gap-2">
      {/* OpenQR */}
      {onOpenQR && (
        <button
          onClick={() =>
            onOpenQR({
              // id: getConnectorId(Amostra),
              id: Amostra ?? "",
              source: "sample",
              refCliente: Ref_Descricao ?? "",
              encomenda: EncDivmac ?? "",
              qty: Quantidade ? parseInt(Quantidade) : undefined,
            })
          }
          title="Print Label"
          className={btnClass1 + " hover:text-green-400"}
        >
          <Printer className="w-4 h-4" />
        </button>
      )}

      {/* Clone */}
      {onClone && (
        <button
          onClick={() => onClone(sample)}
          title="Duplicate"
          className={btnClass1 + " hover:text-amber-400"}
        >
          ⧉
        </button>
      )}

      {/* Edit */}
      <button
        onClick={() => onEdit(sample)}
        title="Edit"
        className={btnClass1 + " hover:text-blue-400"}
      >
        <Pencil className="w-4 h-4" />
      </button>

      {/* Delete */}
      <button
        onClick={() => onDelete(sample)}
        title="Delete"
        className={btnClass1 + " hover:text-red-400"}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default SamplesActionButtons;
