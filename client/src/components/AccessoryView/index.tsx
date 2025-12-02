import React, { useState } from "react";
import { Wrench } from "lucide-react";
import { Accessory } from "../../types";
import { DetailHeader } from "../common/DetailHeader";
import { TransactionBar } from "../common/TransactionBar";
import { NotFoundPage } from "../common/NotFoundPage";
import { useInventoryNavigation } from "../../hooks/useInventoryNavigation";
import { EntityResolver, useEntityDetails } from "../../hooks/useEntityDetails";
import { resolveLiveStock } from "../../utils/stock";
import { API } from "@/utils/api";
import { BoxShortcut } from "../common/BoxShortcut";
import ImageBox from "../common/ImageBox";
import { useGlobalBackNavigation } from "../../hooks/useGlobalBackNavigation";
import StockDiv from "../common/StockDiv";
import AccessoryMetadata from "./components/AccessoryMetadata";
import { VIEW_SUMMARY_CLASS } from "@/utils/constants";
import { parseAccessory } from "@/services/accessoryService";

interface AccessoryViewProps {
  onTransaction: (type: "IN" | "OUT", id?: string) => void;
  onOpenQR: (id: string) => void;
}

/**
 * Converts accessory ID from URL into full Accessory object.
 * Searches masterData.accessories, then parses matching raw API data.
 */
const accessoryResolver: EntityResolver<Accessory> = (
  accessoryId, // e.g., "E143P1_P01129373_CLIPS"
  { stockCache, masterData } // Data from Redux store
) => {
  // Basic validation: ID must have underscores and we need master data
  if (!accessoryId.includes("_") || !masterData || !masterData.accessories)
    return null;

  // Find accessory by matching id
  const apiAccessory = masterData.accessories[accessoryId];

  // If we didn't find it in the API data, return null (will show "not found")
  if (!apiAccessory) return null;

  // Convert the raw API data into a clean Accessory object with proper formatting
  return parseAccessory(apiAccessory, stockCache);
};

export const AccessoryView: React.FC<AccessoryViewProps> = ({
  onTransaction,
  onOpenQR,
}) => {
  // Gets ID from URL, calls resolver to convert ID to Accessory object
  const { entity: accessory, stockCache } =
    useEntityDetails<Accessory>(accessoryResolver);
  const { goBack, goToBox } = useInventoryNavigation();
  const [error, setError] = useState(false);

  // Enable Escape key to go back
  useGlobalBackNavigation(goBack);

  // If the resolver returned null (accessory not found), show error
  if (!accessory) {
    return (
      <NotFoundPage
        label="Accessory"
        icon={Wrench}
        title="Accessory Not Found"
        message="The accessory you are looking for does not exist in the master data."
        onBack={goBack}
      />
    );
  }

  const imageUrl = API.accessoryImages(accessory.id);

  // Get the current stock, preferring live cached data over the parsed fallback
  const currentStock = resolveLiveStock(
    stockCache,
    accessory.id,
    accessory.stock
  );

  const handleBoxOpen = (boxId: string) => {
    goToBox(boxId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 pb-32 text-slate-200">
      <DetailHeader
        label="Accessory"
        title={accessory.id}
        onBack={goBack}
        handleQRClick={() => onOpenQR(accessory.id)}
      />

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <div id="accessory-summary" className={VIEW_SUMMARY_CLASS}>
          {/* Accessory Image */}
          <ImageBox
            error={error}
            imageUrl={imageUrl}
            handleError={() => setError(true)}
          />

          {/* Stock Details */}
          <StockDiv currentStock={currentStock} />

          {/* Accessory Details */}
          <AccessoryMetadata accessory={accessory} />

          {/* <ClientReference
            clientName={accessory.clientName}
            clientRef={accessory.clientRef}
          /> */}
        </div>

        {/* View Box option */}
        <BoxShortcut
          posId={accessory.posId}
          onOpen={() => handleBoxOpen(accessory.posId)}
        />
      </div>

      <TransactionBar
        onRemove={() => onTransaction("OUT", accessory.id)}
        onAdd={() => onTransaction("IN", accessory.id)}
      />
    </div>
  );
};
