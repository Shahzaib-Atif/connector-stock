import React from "react";
import { Wrench } from "lucide-react";
import { Connector } from "../../utils/types";
import { parseConnector } from "../../services/connectorService";
import { DetailHeader } from "../common/DetailHeader";
import { TransactionBar } from "../common/TransactionBar";
import { NotFoundPage } from "../common/NotFoundPage";
import { useInventoryNavigation } from "../../hooks/useInventoryNavigation";
import { useEntityDetails, EntityResolver } from "../../hooks/useEntityDetails";
import { ConnectorSummary } from "./components/ConnectorSummary";
import { AccessoryList } from "./components/AccessoryList";
import { BoxShortcut } from "../common/BoxShortcut";
import { useGlobalBackNavigation } from "../../hooks/useGlobalBackNavigation";
import { useAppSelector } from "../../store/hooks";
import { Edit2 } from "lucide-react";
import { ConnectorEditForm } from "./components/ConnectorEditForm";
import { RelatedImages } from "./components/RelatedImages";
import { UserRoles } from "@/utils/types/userTypes";
import { QRData } from "@/utils/types/shared";

interface ConnectorViewProps {
  onTransaction: (type: "IN" | "OUT", id?: string) => void;
  onOpenQR: (qrData: QRData) => void;
}

const connectorResolver: EntityResolver<Connector> = (
  connectorId,
  { masterData },
) => {
  if (connectorId.length !== 6 || !masterData) return null;
  return parseConnector(connectorId, masterData);
};

export const ConnectorView: React.FC<ConnectorViewProps> = ({
  onTransaction,
  onOpenQR,
}) => {
  const { role } = useAppSelector((state) => state.auth);

  // Shared hook lifts params and cache plumbing.
  const { entity: connector } = useEntityDetails<Connector>(connectorResolver);
  const { goBack, goToAccessory, goToBox } = useInventoryNavigation();
  const [isEditing, setIsEditing] = React.useState(false);

  console.log(connector);

  // Enable Back key to go back
  useGlobalBackNavigation(goBack);

  if (!connector) {
    return <NotFoundPage label="Connector" icon={Wrench} onBack={goBack} />;
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
        title={connector.CODIVMAC}
        onBack={goBack}
        handleQRClick={() =>
          onOpenQR({ id: connector.CODIVMAC, source: "connector" })
        }
      />

      <div
        id="connector-page"
        className="max-w-3xl mx-auto p-4 space-y-4 text-sm sm:text-base"
      >
        {isEditing ? (
          <ConnectorEditForm
            connector={connector}
            onCancel={() => setIsEditing(false)}
            onSave={() => setIsEditing(false)}
          />
        ) : (
          <div className="relative">
            <ConnectorSummary connector={connector} />
            {role === UserRoles.Master && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-slate-800/80 backdrop-blur-md border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700 text-slate-300 hover:text-blue-400 rounded-xl transition-all shadow-lg group"
              >
                <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Edit
                </span>
              </button>
            )}
          </div>
        )}

        {/* Accessories List */}
        {connector.accessories.length > 0 && (
          <AccessoryList
            accessories={connector.accessories}
            onTransaction={onTransaction}
            onInspect={handleAccessoryInspect}
          />
        )}

        {/* Related Images */}
        <RelatedImages connectorId={connector.CODIVMAC} />

        <BoxShortcut
          posId={connector.PosId}
          onOpen={() => handleBoxOpen(connector.PosId)}
        />
      </div>

      <TransactionBar
        onRemove={() => onTransaction("OUT", connector.CODIVMAC)}
        onAdd={() => onTransaction("IN", connector.CODIVMAC)}
        isRemoveDisabled={connector.Qty <= 0}
      />
    </div>
  );
};
