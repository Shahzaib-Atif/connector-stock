import React from "react";
import NumberInputDiv from "@/components/common/NumberInputDiv";
import { ConnectorsDimensions } from "@shared/dto/ConnectorDto";

interface Props {
  dimensions: ConnectorsDimensions;
  setDimensionsField: (
    field: keyof ConnectorsDimensions,
    value: number | null,
  ) => void;
}

export const CreateFormDimensions: React.FC<Props> = ({
  dimensions,
  setDimensionsField,
}) => {
  return (
    <>
      <NumberInputDiv
        label="Internal Ø (mm)"
        value={dimensions.InternalDiameter ?? ""}
        min={0}
        step={0.1}
        onChange={(e) =>
          setDimensionsField(
            "InternalDiameter",
            e.target.value === "" ? null : parseFloat(e.target.value),
          )
        }
      />
      <NumberInputDiv
        label="External Ø (mm)"
        value={dimensions.ExternalDiameter ?? ""}
        min={0}
        step={0.1}
        onChange={(e) =>
          setDimensionsField(
            "ExternalDiameter",
            e.target.value === "" ? null : parseFloat(e.target.value),
          )
        }
      />
      <NumberInputDiv
        label="Thickness (mm)"
        value={dimensions.Thickness ?? ""}
        min={0}
        step={0.1}
        onChange={(e) =>
          setDimensionsField(
            "Thickness",
            e.target.value === "" ? null : parseFloat(e.target.value),
          )
        }
      />
    </>
  );
};
