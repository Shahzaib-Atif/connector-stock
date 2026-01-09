import React from "react";
import CardInfoDiv from "@/components/common/CardInfoDiv";
import { Accessory } from "@/utils/types";

interface Props {
  accessory: Accessory;
}
function AccessoryMetadata({ accessory }: Props) {
  return (
    <div
      id="accessory-metadata"
      className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4"
    >
      <CardInfoDiv label="Type" value={accessory.AccessoryType} />
      <CardInfoDiv label="Connector" value={accessory.ConnName} />
      <CardInfoDiv label="Ref Client" value={accessory.RefClient} />
      {accessory.CapotAngle && (
        <CardInfoDiv label="Capot Angle" value={accessory.CapotAngle} />
      )}
      {accessory.ClipColor && (
        <CardInfoDiv label="Clip Color" value={accessory.ClipColor} />
      )}
    </div>
  );
}

export default AccessoryMetadata;
