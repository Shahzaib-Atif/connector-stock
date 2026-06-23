import NumberInputDiv from "@/components/common/NumberInputDiv";
import { ConnectorCreateFormData } from "./useConnectorCreateForm";
import { useAppSelector } from "@/store/hooks";

interface Props {
  family: number;
  fabricante: string;
  refabricante: string;
  setField: <K extends keyof ConnectorCreateFormData>(
    field: K,
    value: ConnectorCreateFormData[K],
  ) => void;
}

export default function CreateFormDetails({
  setField,
  family,
  fabricante,
  refabricante,
}: Props) {
  const masterData = useAppSelector((state) => state.masterData.data);

  return (
    <>
      {/* Family Input */}
      <NumberInputDiv
        label="Family"
        value={family}
        min={1}
        step={1}
        onChange={(e) => setField("Family", parseInt(e.target.value) || 0)}
      />

      {/* Fabricante dropdown */}
      <div className="space-y-1.5">
        <label htmlFor="create-fabricante-select" className="label-style-4">
          Fabricante
        </label>
        <select
          id="create-fabricante-select"
          value={fabricante}
          onChange={(e) => setField("Fabricante", e.target.value)}
          className="input-style-main input-style-enabled appearance-none cursor-pointer"
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
          value={refabricante}
          onChange={(e) => setField("Refabricante", e.target.value)}
          className="input-style-main input-style-enabled"
        />
      </div>
    </>
  );
}
