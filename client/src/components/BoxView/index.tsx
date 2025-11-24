import React from "react";
import { MapPin, CircuitBoard, Wrench, QrCode } from "lucide-react";
import { Box } from "../../types";
import { getBoxDetails } from "../../services/connectorService";
import { CollapsibleSection } from "../common/CollapsibleSection";
import { DetailHeader } from "../common/DetailHeader";
import { InventoryListItem } from "../common/InventoryListItem";
import { useInventoryNavigation } from "../../hooks/useInventoryNavigation";
import { EntityResolver, useEntityDetails } from "../../hooks/useEntityDetails";
import { resolveLiveStock } from "../../utils/stock";
import BoxCoordinatesCard from "./components/BoxCoordinatesCard";
import ConnectorInfo from "./components/ConnectorInfo";
import StockBadge from "./components/StockBadge";
import AccessoryInfo from "./components/AccessoryInfo";

interface BoxViewProps {
  onOpenQR: (id: string) => void;
}

const boxResolver: EntityResolver<Box> = (boxId, { masterData }) => {
  if (boxId.length !== 4 || !masterData) return null;
  return getBoxDetails(boxId, masterData);
};

export const BoxView: React.FC<BoxViewProps> = ({ onOpenQR }) => {
  // Shared hook supplies resolved box plus cache.
  const { entity: box, stockCache } = useEntityDetails<Box>(boxResolver);
  const { goBack, goToConnector, goToAccessory } = useInventoryNavigation();

  if (!box) return <div>Box not found</div>;

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
        rightSlot={
          <button
            onClick={() => onOpenQR(box.id)}
            className="p-2 -mr-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg"
            aria-label="Show box QR"
          >
            <QrCode className="w-6 h-6" />
          </button>
        }
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
            // Helper keeps each row stock in sync.
            const liveStock = resolveLiveStock(stockCache, conn.id, conn.stock);
            return (
              <InventoryListItem
                key={conn.id}
                onClick={() => handleConnectorScan(conn.id)}
                left={<ConnectorInfo conn={conn} liveStock={liveStock} />}
                right={<StockBadge liveStock={liveStock} />}
              />
            );
          })}
        </CollapsibleSection>

        {/* Accessories List */}
        <CollapsibleSection
          title="Accessories"
          icon={<Wrench className="w-4 h-4" />}
          count={box.accessories.length}
          defaultOpen={false}
        >
          {box.accessories.map((acc) => {
            const liveStock = resolveLiveStock(stockCache, acc.id, acc.stock);
            return (
              <InventoryListItem
                key={acc.id}
                onClick={() => handleAccessoryScan(acc.id)}
                className="hover:border-indigo-500/50 hover:bg-slate-700/50"
                left={<AccessoryInfo acc={acc} />}
                right={<StockBadge liveStock={liveStock} />}
              />
            );
          })}
        </CollapsibleSection>
      </div>
    </div>
  );
};
