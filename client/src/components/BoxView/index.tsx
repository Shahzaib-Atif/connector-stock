import React from "react";
import { MapPin, CircuitBoard, Wrench, QrCode } from "lucide-react";
import { Box } from "../../types";
import { getBoxDetails } from "../../services/connectorService";
import { CollapsibleSection } from "../common/CollapsibleSection";
import { DetailHeader } from "../common/DetailHeader";
import { InventoryListItem } from "../common/InventoryListItem";
import { NotFoundPage } from "../common/NotFoundPage";
import { useInventoryNavigation } from "../../hooks/useInventoryNavigation";
import { EntityResolver, useEntityDetails } from "../../hooks/useEntityDetails";
import BoxCoordinatesCard from "./components/BoxCoordinatesCard";
import ConnectorInfo from "./components/ConnectorInfo";
import StockBadge from "./components/StockBadge";
import AccessoryInfo from "./components/AccessoryInfo";
import { useGlobalBackNavigation } from "../../hooks/useGlobalBackNavigation";

interface BoxViewProps {
  onOpenQR: (id: string) => void;
}

const boxResolver: EntityResolver<Box> = (boxId, { masterData }) => {
  if (boxId.length !== 4 || !masterData) return null;
  return getBoxDetails(boxId, masterData);
};

export const BoxView: React.FC<BoxViewProps> = ({ onOpenQR }) => {
  // resolve box plus cache.
  const { entity: box } = useEntityDetails<Box>(boxResolver);
  const { goBack, goToConnector, goToAccessory } = useInventoryNavigation();

  // Enable Back key to go back
  useGlobalBackNavigation(goBack);

  // show not found page if box not found
  if (!box || box.ch === "?" || box.cv === "?") {
    return <NotFoundPage label="Box" icon={MapPin} onBack={goBack} />;
  }

  const handleConnectorScan = (connectorId: string) => {
    goToConnector(connectorId);
  };

  const handleAccessoryScan = (accessoryId: string) => {
    goToAccessory(accessoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 pb-12 text-slate-200">
      {/* Header */}
      <DetailHeader
        label="Box Storage"
        title={box.id}
        onBack={goBack}
        handleQRClick={() => onOpenQR(box.id)}
      />

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Coordinates */}
        <BoxCoordinatesCard box={box} />

        {/* Connectors List */}
        <CollapsibleSection
          title="Connectors"
          icon={<CircuitBoard className="w-4 h-4" />}
          count={box.connectors.length}
          defaultOpen={true}
        >
          {box.connectors.map((conn) => {
            return (
              <InventoryListItem
                key={conn.id}
                onClick={() => handleConnectorScan(conn.id)}
                left={<ConnectorInfo conn={conn} liveStock={conn.stock} />}
                right={<StockBadge liveStock={conn.stock} />}
              />
            );
          })}
        </CollapsibleSection>

        {/* Accessories List */}
        <CollapsibleSection
          title="Accessories"
          icon={<Wrench className="w-4 h-4" />}
          count={box.accessories.length}
          defaultOpen={true}
        >
          {box.accessories.map((acc) => {
            return (
              <InventoryListItem
                key={acc.id}
                onClick={() => handleAccessoryScan(acc.id)}
                left={<AccessoryInfo acc={acc} liveStock={acc.stock} />}
                right={<StockBadge liveStock={acc.stock} />}
              />
            );
          })}
        </CollapsibleSection>
      </div>
    </div>
  );
};
