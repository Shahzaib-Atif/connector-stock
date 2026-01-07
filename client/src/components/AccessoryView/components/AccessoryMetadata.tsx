import CardInfoDiv from "@/components/common/CardInfoDiv";
import { Accessory } from "@/utils/types/types";

interface Props {
  accessory: Accessory;
}
function AccessoryMetadata({ accessory }: Props) {
  return (
    <div
      id="accessory-metadata"
      className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4"
    >
      <CardInfoDiv label="Type" value={accessory.type} />
      <CardInfoDiv label="Connector" value={accessory.connectorId} />
      <CardInfoDiv label="Ref Client" value={accessory.refClient} />
      {accessory.capotAngle && (
        <CardInfoDiv label="Capot Angle" value={accessory.capotAngle} />
      )}
      {accessory.clipColor && (
        <CardInfoDiv label="Clip Color" value={accessory.clipColor} />
      )}
    </div>
  );
}

export default AccessoryMetadata;
