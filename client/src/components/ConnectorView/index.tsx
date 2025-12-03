import React from "react";
import { Wrench, QrCode } from "lucide-react";
import { Connector } from "../../types";
import { parseConnector } from "../../services/connectorService";
import { CollapsibleSection } from "../common/CollapsibleSection";
import { DetailHeader } from "../common/DetailHeader";
import { TransactionBar } from "../common/TransactionBar";
import { NotFoundPage } from "../common/NotFoundPage";
import { useInventoryNavigation } from "../../hooks/useInventoryNavigation";
import { useEntityDetails, EntityResolver } from "../../hooks/useEntityDetails";
import { ConnectorSummary } from "./components/ConnectorSummary";
import { AccessoryList } from "./components/AccessoryList";
import { BoxShortcut } from "../common/BoxShortcut";
import { useGlobalBackNavigation } from "../../hooks/useGlobalBackNavigation";

interface ConnectorViewProps {
  onTransaction: (type: "IN" | "OUT", id?: string) => void;
  onOpenQR: (id: string) => void;
}

const connectorResolver: EntityResolver<Connector> = (
  connectorId,
  { masterData }
) => {
  if (connectorId.length !== 6 || !masterData) return null;
  return parseConnector(connectorId, masterData);
};

export const ConnectorView: React.FC<ConnectorViewProps> = ({
  onTransaction,
  onOpenQR,
}) => {
  // Shared hook lifts params and cache plumbing.
  const { entity: connector } = useEntityDetails<Connector>(connectorResolver);
  const { goBack, goToAccessory, goToBox } = useInventoryNavigation();

  // Enable Back key to go back
  useGlobalBackNavigation(goBack);

  if (!connector) {
    return (
      <NotFoundPage
        label="Connector"
        icon={Wrench}
        title="Connector Not Found"
        message="The connector you are looking for does not exist in the master data."
        onBack={goBack}
      />
    );
  }

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
        handleQRClick={() => onOpenQR(connector.id)}
      />

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <ConnectorSummary connector={connector} />

        {/* Accessories List */}
        {connector.accessories.length > 0 && (
          <CollapsibleSection
            title="Associated Accessories"
            icon={<Wrench className="w-4 h-4" />}
            count={connector.accessories.length}
          >
            <AccessoryList
              accessories={connector.accessories}
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
