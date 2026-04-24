import React from "react";
import { MapPin, CircuitBoard, Wrench } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Box } from "../../utils/types";
import { getBoxDetails } from "../../utils/functions/connector";
import { CollapsibleSection } from "../common/CollapsibleSection";
import { DetailHeader } from "../common/DetailHeader";
import { InventoryListItem } from "../common/InventoryListItem";
import { NotFoundPage } from "../common/NotFoundPage";
import { useInventoryNavigation } from "../../hooks/useInventoryNavigation";
import BoxCoordinatesCard from "./components/BoxCoordinatesCard";
import ConnectorInfo from "./components/ConnectorInfo";
import StockBadge from "./components/StockBadge";
import AccessoryInfo from "./components/AccessoryInfo";
import { useGlobalBackNavigation } from "../../hooks/useGlobalBackNavigation";
import { QRData } from "@/utils/types/shared";
import { useAppSelector } from "@/store/hooks";

interface BoxViewProps {
  onOpenQR: (qrData: QRData) => void;
}

export const BoxView: React.FC<BoxViewProps> = ({ onOpenQR }) => {
  const { id } = useParams<{ id: string }>();
  const masterData = useAppSelector((state) => state.masterData.data);
  const box = useMemo<Box | null>(() => {
    if (!id || id.length !== 4 || !masterData) {
      return null;
    }

    return getBoxDetails(id, masterData);
  }, [id, masterData]);
  const { goBack, goToConnector, goToAccessory } = useInventoryNavigation();

  // Enable Back key to go back
  useGlobalBackNavigation(goBack);

  // show not found page if box not found or has no coordinates
  if (!box || (!box.ch && !box.cv && !box.ch_ma && !box.cv_ma)) {
    return <NotFoundPage label="Box" icon={MapPin} onBack={goBack} />;
  }

  const handleConnectorScan = (connectorId: string) => {
    goToConnector(connectorId);
  };

  const handleAccessoryScan = (accessoryId: number) => {
    goToAccessory(accessoryId);
  };

  return (
    <div
      id="box-page"
      className="text-sm sm:text-base min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 pb-12 text-slate-200"
    >
      {/* Header */}
      <DetailHeader
        label="Box Storage"
        title={box.id}
        onBack={goBack}
        handleQRClick={() => onOpenQR({ id: box.id, source: "box" })}
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
                key={conn.CODIVMAC}
                onClick={() => handleConnectorScan(conn.CODIVMAC)}
                left={<ConnectorInfo conn={conn} liveStock={conn.Qty} />}
                right={<StockBadge liveStock={conn.Qty} />}
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
                key={acc.Id}
                onClick={() => handleAccessoryScan(acc.Id)}
                left={<AccessoryInfo acc={acc} liveStock={acc.Qty} />}
                right={
                  acc?.AccessoryType?.toUpperCase() !== "MIOLO" && (
                    <StockBadge liveStock={acc.Qty} />
                  )
                }
              />
            );
          })}
        </CollapsibleSection>
      </div>
    </div>
  );
};
