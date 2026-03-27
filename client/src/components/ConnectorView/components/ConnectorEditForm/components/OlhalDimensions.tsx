import NumberInputDiv from "@/components/common/NumberInputDiv";
import { ConnectorFormData } from "./ConnectorFormData";
import { ConnectorsDimensions } from "@shared/dto/ConnectorDto";

interface Props {
  formData: ConnectorFormData;
  setDimensionsField: (
    field: keyof ConnectorsDimensions,
    value: number | undefined,
  ) => void;
}

function OlhalDimensions({ formData, setDimensionsField }: Props) {
  const handleChange =
    (field: keyof ConnectorsDimensions) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDimensionsField(
        field,
        e.target.value === "" ? undefined : parseFloat(e.target.value),
      );
    };

  return (
    <>
      <NumberInputDiv
        label="Internal Ø (mm)"
        value={formData.dimensions?.InternalDiameter ?? ""}
        min={0}
        step={0.1}
        onChange={(e) => handleChange("InternalDiameter")(e)}
      />

      <NumberInputDiv
        label="External Ø (mm)"
        value={formData.dimensions?.ExternalDiameter ?? ""}
        min={0}
        step={0.1}
        onChange={(e) => handleChange("ExternalDiameter")(e)}
      />

      <NumberInputDiv
        label="Thickness (mm)"
        value={formData.dimensions?.Thickness ?? ""}
        min={0}
        step={0.1}
        onChange={(e) => handleChange("Thickness")(e)}
      />
    </>
  );
}

export default OlhalDimensions;
