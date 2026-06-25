import NumberInputDiv from "@/components/common/NumberInputDiv";
import { useAppSelector } from "@/store/hooks";
import { ConnectorsDetails } from "@shared/dto/ConnectorDto";
import { inputClassEnabled } from "./utils";
import { CreateFormQuantities } from "./CreateFormQuantities";
import { ConnectorCreateFormData } from "./useConnectorCreateForm";

interface Props {
  formData: ConnectorCreateFormData;
  setDetailsField: (
    field: keyof ConnectorsDetails,
    value: string | number,
  ) => void;
  setQtyField: (field: "Qty_com_fio" | "Qty_sem_fio", value: number) => void;
}

export default function CreateFormDetails({
  formData,
  setDetailsField,
  setQtyField,
}: Props) {
  const masterData = useAppSelector((state) => state.masterData.data);
  const { details } = formData;
  const { Family, Fabricante, Refabricante } = details;

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* Family Input */}
      <NumberInputDiv
        label="Family"
        value={Family}
        min={1}
        step={1}
        onChange={(e) =>
          setDetailsField("Family", parseInt(e.target.value) || 0)
        }
      />

      {/* Fabricante dropdown */}
      <div className="space-y-1.5">
        <label htmlFor="create-fabricante-select" className="label-style-4">
          Fabricante
        </label>
        <select
          id="create-fabricante-select"
          value={Fabricante ?? ""}
          onChange={(e) => setDetailsField("Fabricante", e.target.value)}
          className={inputClassEnabled}
        >
          <option value="">unknown</option>
          {masterData?.fabricantes.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Refabricante */}
      <div className="space-y-1.5">
        <label htmlFor="create-Refabricante" className="label-style-4">
          Refabricante
        </label>
        <input
          id="create-Refabricante"
          type="text"
          value={Refabricante ?? ""}
          onChange={(e) => setDetailsField("Refabricante", e.target.value)}
          className="input-style-main input-style-enabled"
        />
      </div>

      <CreateFormQuantities
        qtyComFio={formData.Qty_com_fio}
        qtySemFio={formData.Qty_sem_fio}
        setQtyField={setQtyField}
      />

      <div className="space-y-1.5">
        <label htmlFor="create-Observation" className="label-style-4">
          Observation
        </label>{" "}
        <textarea
          name="Observacoes"
          value={formData.details.OBS ?? ""}
          onChange={(e) => setDetailsField("OBS", e.target.value)}
          rows={3}
          className="input-style-main input-style-enabled"
          placeholder="Notes and observations"
        />
      </div>
    </div>
  );
}
