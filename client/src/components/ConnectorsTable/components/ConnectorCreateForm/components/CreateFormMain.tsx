import { useAppSelector } from "@/store/hooks";
import { ConnectorCreateFormData } from "./useConnectorCreateForm";
import { useMemo } from "react";

interface Props {
  codivmac: string;
  posId: string;
  color: string;
  connType: string;
  setField: <K extends keyof ConnectorCreateFormData>(
    field: K,
    value: ConnectorCreateFormData[K],
  ) => void;
}

function CreateFormMain({ setField, codivmac, posId, color, connType }: Props) {
  const masterData = useAppSelector((state) => state.masterData.data);

  const colorOptionsKeys = useMemo(() => {
    return masterData?.colors?.colorsPT
      ? Object.keys(masterData.colors.colorsPT)
      : [];
  }, [masterData]);

  return (
    <>
      {/* CODIVMAC */}
      <div className="space-y-1.5">
        <label htmlFor="codivmac-input" className="label-style-4">
          CODIVMAC
        </label>
        <input
          id="codivmac-input"
          type="text"
          value={codivmac}
          readOnly
          className="input-style-main input-style-disabled uppercase"
        />
      </div>

      {/* Position / Box ID (Autocomplete) */}
      <div className="space-y-1.5">
        <label htmlFor="posid-autocomplete" className="label-style-4">
          Pos ID *
        </label>
        <input
          value={posId}
          type="text"
          maxLength={4}
          onChange={(e) => setField("PosId", e.target.value.toUpperCase())}
          required
          className="input-style-main input-style-enabled"
        />
      </div>

      {/* Color Dropdown */}
      <div className="space-y-1.5">
        <label htmlFor="create-color-select" className="label-style-4">
          Color *
        </label>
        <select
          id="create-color-select"
          required
          value={color}
          onChange={(e) => setField("Cor", e.target.value)}
          className="input-style-main input-style-enabled appearance-none cursor-pointer"
        >
          <option value="">Select color...</option>
          {colorOptionsKeys.map((key) => (
            <option key={key} value={key}>
              {key} ({masterData?.colors?.colorsPT[key]} /{" "}
              {masterData?.colors?.colorsUK[key]})
            </option>
          ))}
        </select>
      </div>

      {/* Type Dropdown */}
      <div className="space-y-1.5">
        <label htmlFor="create-conn-type-select" className="label-style-4">
          Type *
        </label>
        <select
          id="create-conn-type-select"
          value={connType}
          onChange={(e) => setField("ConnType", e.target.value)}
          required
          className="input-style-main input-style-enabled appearance-none cursor-pointer"
        >
          <option value="">Unknown type</option>
          {masterData?.connectorTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default CreateFormMain;
