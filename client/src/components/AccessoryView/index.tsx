import React, { useMemo, useState } from "react";
import { Wrench, Edit2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { DetailHeader } from "../common/DetailHeader";
import { TransactionBar } from "../common/TransactionBar";
import { NotFoundPage } from "../common/NotFoundPage";
import { useInventoryNavigation } from "../../hooks/useInventoryNavigation";
import { API } from "@/utils/api";
import { BoxShortcut } from "../common/BoxShortcut";
import ImageBox from "../common/ImageBox";
import { useGlobalBackNavigation } from "../../hooks/useGlobalBackNavigation";
import StockDiv from "../common/StockDiv";
import AccessoryMetadata from "./components/AccessoryMetadata";
import { VIEW_SUMMARY_CLASS } from "@/utils/constants";
import { QRData } from "@/utils/types/shared";
import { AccessoryEditForm } from "./components/AccessoryEditForm";
import { useAppSelector } from "@/store/hooks";
import { RelatedAccessoryImages } from "./components/RelatedAccessoryImages";
import { UserRoles } from "@shared/enums/UserRoles";
import { AccessoryExtended } from "@/utils/types";
import { TransactionOpenOptions } from "@/utils/types/transactionTypes";

interface AccessoryViewProps {
  onTransaction: (txOptions: TransactionOpenOptions) => void;
  onOpenQR?: (qrData: QRData) => void;
}

export const AccessoryView: React.FC<AccessoryViewProps> = ({
  onTransaction,
}) => {
  const { id } = useParams<{ id: string }>();
  const { goBack, goToBox } = useInventoryNavigation();
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const masterData = useAppSelector((state) => state.masterData.data);
  const { role, user } = useAppSelector((state) => state.auth);
  const isEditAllowed = role === UserRoles.Master || user === "admin1";
  const accessory = useMemo<AccessoryExtended | null>(() => {
    const accessoryId = Number(id);

    if (!Number.isInteger(accessoryId) || !masterData) {
      return null;
    }

    return masterData.accessories[accessoryId] ?? null;
  }, [id, masterData]);

  // Enable Escape key to go back
  useGlobalBackNavigation(goBack);

  // If the resolver returned null (accessory not found), show error
  if (!accessory) {
    return <NotFoundPage label="Accessory" icon={Wrench} onBack={goBack} />;
  }

  const imageUrl = API.accessoryImages(accessory.Id);
  const isMiolo = accessory?.AccessoryType?.toUpperCase() === "MIOLO"; // Miolo type accessory doesn't show transaction bar

  const handleBoxOpen = (boxId: string) => {
    if (boxId) goToBox(boxId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 pb-32 text-slate-200">
      <DetailHeader
        label="Accessory"
        title={accessory.customId}
        onBack={goBack}
      />

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {isEditing ? (
          <AccessoryEditForm
            accessory={accessory}
            onCancel={() => setIsEditing(false)}
            onSave={() => setIsEditing(false)}
          />
        ) : (
          <div className="relative">
            <div id="accessory-summary" className={VIEW_SUMMARY_CLASS}>
              {/* Accessory Image */}
              <ImageBox
                error={error}
                imageUrl={imageUrl}
                handleError={() => setError(true)}
              />

              {/* Stock Details */}
              {accessory?.AccessoryType?.toUpperCase() !== "MIOLO" && (
                <StockDiv currentStock={accessory.Qty} />
              )}

              {/* Accessory Details */}
              <AccessoryMetadata accessory={accessory} />
            </div>
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

        {/* Related Images */}
        <RelatedAccessoryImages accessoryId={accessory.customId} />

        {/* View Box option */}
        <BoxShortcut
          posId={accessory.posId || ""}
          onOpen={() => handleBoxOpen(accessory.posId || "")}
        />
      </div>

      {!isMiolo && (
        <TransactionBar
          onRemove={() =>
            onTransaction({
              transactionType: "OUT",
              itemType: "accessory",
              targetId: accessory.Id,
            })
          }
          onAdd={() =>
            onTransaction({
              transactionType: "IN",
              itemType: "accessory",
              targetId: accessory.Id,
            })
          }
          isRemoveDisabled={accessory.Qty <= 0}
        />
      )}
    </div>
  );
};
