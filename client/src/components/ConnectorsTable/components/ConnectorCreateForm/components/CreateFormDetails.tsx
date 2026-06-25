import NumberInputDiv from "@/components/common/NumberInputDiv";
import { useAppSelector } from "@/store/hooks";
import { ConnectorsDetails } from "@shared/dto/ConnectorDto";

interface Props {
  details: ConnectorsDetails;
  setDetailsField: (
    field: keyof ConnectorsDetails,
    value: string | number,
  ) => void;
}

export default function CreateFormDetails({ setDetailsField, details }: Props) {
  const masterData = useAppSelector((state) => state.masterData.data);
  const { Family, Fabricante, Refabricante } = details;

  return (
    <>
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
          value={Refabricante ?? ""}
          onChange={(e) => setDetailsField("Refabricante", e.target.value)}
          className="input-style-main input-style-enabled"
        />
      </div>
    </>
  );
}
