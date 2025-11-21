import React from "react";
import { Wrench, QrCode } from "lucide-react";
import { Connector } from "../../types";
import { parseConnector } from "../../services/inventoryService";
import { CollapsibleSection } from "../CollapsibleSection";
import { InsightCard } from "../InsightCard";
import { DetailHeader } from "../DetailHeader";
import { TransactionBar } from "../TransactionBar";
import { useInventoryNavigation } from "../../hooks/useInventoryNavigation";
import {
  useEntityDetails,
  EntityResolver,
} from "../../hooks/useEntityDetails";
import { resolveLiveStock } from "../../utils/stock";
import { ConnectorSummary } from "./ConnectorSummary";
import { AccessoryList } from "./AccessoryList";
import { BoxShortcut } from "./BoxShortcut";

interface ConnectorViewProps {
  onTransaction: (type: "IN" | "OUT", id?: string) => void;
  onOpenQR: (id: string) => void;
}

const connectorResolver: EntityResolver<Connector> = (
  connectorId,
  { stockCache }
) => {
  if (connectorId.length !== 6) return null;
  return parseConnector(connectorId, stockCache);
};

export const ConnectorView: React.FC<ConnectorViewProps> = ({
  onTransaction,
  onOpenQR,
}) => {
  // Shared hook lifts params and cache plumbing.
  const { entity: connector, stockCache } =
    useEntityDetails<Connector>(connectorResolver);
  const { goBack, goToAccessory, goToBox } = useInventoryNavigation();

  if (!connector) return <div>Connector not found</div>;

  // Prefer cached quantity with parsed fallback.
  const currentStock = resolveLiveStock(
    stockCache,
    connector.id,
    connector.stock
  );

  const handleAccessoryInspect = (accessoryId: string) => {
    goToAccessory(accessoryId);
  };

  const handleBoxOpen = (boxId: string) => {
    goToBox(boxId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 pb-32 text-slate-200">
      <DetailHeader
        label="Connector"
        title={connector.id}
        onBack={goBack}
        rightSlot={
          <button
            onClick={() => onOpenQR(connector.id)}
            className="p-2 -mr-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg"
            aria-label="Show connector QR"
          >
            <QrCode className="w-6 h-6" />
          </button>
        }
      />

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <ConnectorSummary connector={connector} currentStock={currentStock} />
        <InsightCard connector={connector} />

        {connector.accessories.length > 0 && (
          <CollapsibleSection
            title="Associated Accessories"
            icon={<Wrench className="w-4 h-4" />}
            count={connector.accessories.length}
          >
            <AccessoryList
              accessories={connector.accessories}
              stockCache={stockCache}
              onTransaction={onTransaction}
              onInspect={handleAccessoryInspect}
            />
          </CollapsibleSection>
        )}

        <BoxShortcut
          posId={connector.posId}
          onOpen={() => handleBoxOpen(connector.posId)}
        />
      </div>

      <TransactionBar
        onRemove={() => onTransaction("OUT", connector.id)}
        onAdd={() => onTransaction("IN", connector.id)}
      />
    </div>
  );
};

