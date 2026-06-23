import { useMemo } from "react";
import { ConnectorCreateFormData } from "./useConnectorCreateForm";
import { useAppSelector } from "@/store/hooks";
import NumberInputDiv from "@/components/common/NumberInputDiv";

interface Props {
  vias: string;
  actualViaCount: number;
  setField: <K extends keyof ConnectorCreateFormData>(
    field: K,
    value: ConnectorCreateFormData[K],
  ) => void;
}

function CreateFormVias({ setField, vias, actualViaCount }: Props) {
  const masterData = useAppSelector((state) => state.masterData.data);

  const viasOptionsKeys = useMemo(() => {
    return masterData?.vias ? Object.keys(masterData.vias) : [];
  }, [masterData]);

  const isViasX = vias?.toUpperCase() === "X";

  return (
    <>
      {/* Vias Dropdown */}
      <div className="space-y-1.5">
        <label htmlFor="create-vias-select" className="label-style-4">
          Vias *
        </label>
        <select
          id="create-vias-select"
          required
          value={vias}
          onChange={(e) => setField("Vias", e.target.value)}
          className="input-style-main input-style-enabled appearance-none cursor-pointer"
        >
          <option value="">Select vias count...</option>
          {viasOptionsKeys.map((key) => (
            <option key={key} value={key}>
              {key} ({masterData?.vias[key]})
            </option>
          ))}
        </select>
      </div>

      {/* Actual Via Count */}
      {isViasX ? (
        <NumberInputDiv
          label="Actual Vias Count"
          value={actualViaCount}
          min={1}
          onChange={(e) =>
            setField("ActualViaCount", parseInt(e.target.value) || 0)
          }
        />
      ) : (
        <div className="space-y-1.5">
          <label className="label-style-4">Actual Vias Count</label>
          <div className="input-style-main input-style-disabled">
            {masterData?.vias[vias] || "Select Vias option first"}
          </div>
        </div>
      )}
    </>
  );
}

export default CreateFormVias;
