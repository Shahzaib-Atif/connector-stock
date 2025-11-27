import React, { useState, useEffect, useRef } from "react";
import { QrCode, Wrench } from "lucide-react";
import { Accessory } from "../../types";
import {
  constructAccessoryId,
  parseAccessory,
} from "../../services/connectorService";
import { DetailHeader } from "../common/DetailHeader";
import { TransactionBar } from "../common/TransactionBar";
import { NotFoundPage } from "../common/NotFoundPage";
import { useInventoryNavigation } from "../../hooks/useInventoryNavigation";
import { EntityResolver, useEntityDetails } from "../../hooks/useEntityDetails";
import { resolveLiveStock } from "../../utils/stock";
import { API } from "@/utils/api";
import { BoxShortcut } from "../common/BoxShortcut";
import ImageBox from "../common/ImageBox";
import AccessoryDetailsCard from "./components/AccessoryDetailsCard";
import { useGlobalBackNavigation } from "../../hooks/useGlobalBackNavigation";

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

  // Find accessory by reconstructing ID format: ConnName_RefClient_RefDV
  const apiAccessory = masterData.accessories.find((acc) => {
    return accessoryId === constructAccessoryId(acc);
  });

  // If we didn't find it in the API data, return null (will show "not found")
  if (!apiAccessory) return null;

  // Convert the raw API data into a clean Accessory object with proper formatting
  return parseAccessory(apiAccessory, stockCache, masterData);
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
        rightSlot={
          <button
            onClick={() => onOpenQR(accessory.id)}
            className="p-2 -mr-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg"
            aria-label="Show accessory QR"
          >
            <QrCode className="w-6 h-6" />
          </button>
        }
      />

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <div className="bg-slate-800/50 rounded-2xl p-6 shadow-lg border border-slate-700">
          {/* Accessory Image */}
          <ImageBox
            error={error}
            imageUrl={imageUrl}
            handleError={() => setError(true)}
          />

          {/* Stock Details */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-4xl font-bold text-white">{currentStock}</h2>
              <p className="text-slate-400 font-medium mt-1">Units Available</p>
            </div>
          </div>

          {/* Accessory Details */}
          <AccessoryDetailsCard accessory={accessory} />
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
