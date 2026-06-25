import { useAppSelector } from "@/store/hooks";
import { ConnectorCreateFormData } from "./useConnectorCreateForm";
import { useMemo } from "react";
import { CreateFormDimensions } from "./CreateFormDimensions";
import {
  ConnectorsDetails,
  ConnectorsDimensions,
} from "@shared/dto/ConnectorDto";
import NumberInputDiv from "@/components/common/NumberInputDiv";
import { inputClassEnabled } from "./utils";

interface Props {
  codivmac: string;
  formData: ConnectorCreateFormData;
  setField: <K extends keyof ConnectorCreateFormData>(
    field: K,
    value: ConnectorCreateFormData[K],
  ) => void;
  setDimensionsField: (
    field: keyof ConnectorsDimensions,
    value: number | null,
  ) => void;
  setDetailsField: (
    field: keyof ConnectorsDetails,
    value: string | number,
  ) => void;
}

function CreateFormMain({
  codivmac,
  formData,
  setField,
  setDimensionsField,
  setDetailsField,
}: Props) {
  const masterData = useAppSelector((state) => state.masterData.data);

  const colors = masterData?.colors;
  const { ConnType, Cor, PosId, Vias, details } = formData;
  const { ActualViaCount, ClipColor } = details;
  const isOlhalType = ConnType?.toLowerCase() === "olhal";
  const isViasX = Vias?.toUpperCase() === "X";
  const isClipType = ConnType?.toLowerCase() === "clip";

  const colorOptionsKeys = useMemo(() => {
    return masterData?.colors?.colorsPT
      ? Object.keys(masterData.colors.colorsPT)
      : [];
  }, [masterData]);

  const viasOptionsKeys = useMemo(() => {
    return masterData?.vias ? Object.keys(masterData.vias) : [];
  }, []);

  return (
    <div className="flex flex-col gap-4 flex-1">
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
          value={PosId}
          type="text"
          maxLength={4}
          onChange={(e) => setField("PosId", e.target.value.toUpperCase())}
          required
          autoComplete="off"
          className="input-style-main input-style-enabled"
        />
      </div>

      {/* Type Dropdown */}
      <div className="space-y-1.5">
        <label htmlFor="create-conn-type-select" className="label-style-4">
          Type *
        </label>
        <select
          id="create-conn-type-select"
          value={ConnType}
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

      {/* Color Dropdown */}
      <div className="space-y-1.5">
        <label htmlFor="create-color-select" className="label-style-4">
          Color *
        </label>
        <select
          id="create-color-select"
          required
          value={Cor}
          onChange={(e) => setField("Cor", e.target.value)}
          className="input-style-main input-style-enabled appearance-none cursor-pointer"
        >
          <option value="">Select color...</option>
          {colorOptionsKeys.map((key) => (
            <option key={key} value={key}>
              {colors?.colorsPT[key]} ({colors?.colorsUK[key]})
            </option>
          ))}
        </select>
      </div>

      {/* Vias Dropdown */}
      <div className="space-y-1.5">
        <label htmlFor="create-vias-select" className="label-style-4">
          Vias *
        </label>
        <select
          id="create-vias-select"
          required
          value={Vias}
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
      {isViasX && (
        <NumberInputDiv
          label="Actual Vias Count"
          value={ActualViaCount ?? 0}
          min={1}
          onChange={(e) =>
            setDetailsField("ActualViaCount", parseInt(e.target.value) || 0)
          }
        />
      )}

      {/* Dimensions (only for "olhal" type) */}
      {isOlhalType && (
        <CreateFormDimensions
          dimensions={formData.dimensions}
          setDimensionsField={setDimensionsField}
        />
      )}

      {/* Clip Color Dropdown */}
      {isClipType && (
        <div className="space-y-1.5">
          <label htmlFor="create-vias-select" className="label-style-4">
            Clip Color
          </label>
          <select
            id="create-vias-select"
            value={ClipColor ?? ""}
            onChange={(e) => setDetailsField("ClipColor", e.target.value)}
            className={inputClassEnabled}
          >
            <option value="">Select clip color...</option>
            {colorOptionsKeys.map((key) => (
              <option key={key} value={key}>
                {colors?.colorsPT[key]} ({colors?.colorsUK[key]})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default CreateFormMain;
