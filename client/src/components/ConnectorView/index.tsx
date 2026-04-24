import React from "react";
import { Wrench } from "lucide-react";
import { useParams } from "react-router-dom";
import { ConnectorSummary } from "./components/ConnectorSummary";
import { AccessoryList } from "./components/AccessoryList";
import { BoxShortcut } from "../common/BoxShortcut";
import { Edit2 } from "lucide-react";
import { ConnectorEditForm } from "./components/ConnectorEditForm";
import { RelatedImages } from "./components/RelatedImages";
import { UserRoles } from "@shared/enums/UserRoles";
import { QRData } from "@/utils/types/shared";
import { ConnectorExtended } from "@/utils/types";
import { parseConnector } from "@/utils/functions/connector";
import { useAppSelector } from "@/store/hooks";
import { useInventoryNavigation } from "@/hooks/useInventoryNavigation";
import { useGlobalBackNavigation } from "@/hooks/useGlobalBackNavigation";
import { NotFoundPage } from "../common/NotFoundPage";
import { DetailHeader } from "../common/DetailHeader";
import { TransactionBar } from "../common/TransactionBar";
import { TransactionOpenOptions } from "@/utils/types/transactionTypes";

interface ConnectorViewProps {
  onTransaction: (txOptions: TransactionOpenOptions) => void;
  onOpenQR: (qrData: QRData) => void;
}

export const ConnectorView: React.FC<ConnectorViewProps> = ({
  onTransaction,
  onOpenQR,
}) => {
  const { id } = useParams<{ id: string }>();
  const masterData = useAppSelector((state) => state.masterData.data);
  const { role, user } = useAppSelector((state) => state.auth);
  const isEditAllowed = role === UserRoles.Master || user === "admin1";
  const connector = React.useMemo<ConnectorExtended | null>(() => {
    if (!id || (id.length !== 6 && id.length !== 8) || !masterData) {
      return null;
    }

    return parseConnector(id, masterData);
  }, [id, masterData]);
  const { goBack, goToAccessory, goToBox } = useInventoryNavigation();
  const [isEditing, setIsEditing] = React.useState(false);

  // Enable Back key to go back
  useGlobalBackNavigation(goBack);

  if (!connector) {
    return <NotFoundPage label="Connector" icon={Wrench} onBack={goBack} />;
  }

  const handleAccessoryInspect = (accessoryId: number) => {
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
            {isEditAllowed && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 flex-row px-3 py-2 bg-slate-800/80 backdrop-blur-md border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700 text-slate-300 hover:text-blue-400 rounded-xl transition-all shadow-lg group"
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
        <RelatedImages
          connectorId={connector.CODIVMAC}
          connType={connector.ConnType ?? ""}
        />

        <BoxShortcut
          posId={connector.PosId}
          onOpen={() => handleBoxOpen(connector.PosId)}
        />
      </div>

      <TransactionBar
        // onRemove={() => onTransaction("OUT", connector.id)}
        onRemove={() =>
          onTransaction({
            transactionType: "OUT",
            itemType: "connector",
            targetId: connector.CODIVMAC,
          })
        }
        onAdd={() =>
          onTransaction({
            transactionType: "IN",
            itemType: "connector",
            targetId: connector.CODIVMAC,
          })
        }
        isRemoveDisabled={connector.Qty <= 0}
      />
    </div>
  );
};
