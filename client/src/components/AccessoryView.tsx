import React from "react";
import { QrCode } from "lucide-react";
import { Accessory } from "../types";
import { parseAccessory } from "../services/connectorService";
import { DetailHeader } from "./common/DetailHeader";
import { TransactionBar } from "./common/TransactionBar";
import { useInventoryNavigation } from "../hooks/useInventoryNavigation";
import { EntityResolver, useEntityDetails } from "../hooks/useEntityDetails";
import { resolveLiveStock } from "../utils/stock";

interface AccessoryViewProps {
  onTransaction: (type: "IN" | "OUT", id?: string) => void;
  onOpenQR: (id: string) => void;
}

/**
 * Converts accessory ID from URL into full Accessory object.
 * Searches masterData.accessories, then parses matching raw API data.
 */
const accessoryResolver: EntityResolver<Accessory> = (
  accessoryId,              // e.g., "E143P1_P01129373_CLIPS"
  { stockCache, masterData } // Data from Redux store
) => {
  // Basic validation: ID must have underscores and we need master data
  if (!accessoryId.includes("_") || !masterData || !masterData.accessories) return null;
  
  // Find accessory by reconstructing ID format: ConnName_RefClient_RefDV
  const apiAccessory = masterData.accessories.find((acc) => {
    const connName = acc.ConnName || "";    // e.g., "E143P1"
    const refClient = acc.RefClient || "";  // e.g., "P01129373"
    const refDV = acc.RefDV || "";          // e.g., "CLIPS"
    const id = `${connName}_${refClient}_${refDV}`;
    return id === accessoryId;
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
  const { goBack } = useInventoryNavigation();

  // If the resolver returned null (accessory not found), show error
  if (!accessory) return <div>Accessory not found</div>;

  // Get the current stock, preferring live cached data over the parsed fallback
  const currentStock = resolveLiveStock(
    stockCache,
    accessory.id,
    accessory.stock
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 pb-32 text-slate-200">
      <DetailHeader
        label="Accessory"
        title={accessory.id}
        onBack={goBack}
        rightSlot={
          <button
            onClick={() => onOpenQR(`/accessory/${accessory.id}`)}
            className="p-2 -mr-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg"
            aria-label="Show accessory QR"
          >
            <QrCode className="w-6 h-6" />
          </button>
        }
      />

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <div className="bg-slate-800/50 rounded-2xl p-6 shadow-lg border border-slate-700">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-4xl font-bold text-white">{currentStock}</h2>
              <p className="text-slate-400 font-medium mt-1">Units Available</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="text-xs text-slate-500 uppercase font-bold mb-1">
                Type
              </div>
              <div className="text-slate-200">{accessory.type}</div>
            </div>

            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="text-xs text-slate-500 uppercase font-bold mb-1">
                Connector
              </div>
              <div className="text-slate-200 font-mono">
                {accessory.connectorId}
              </div>
            </div>

            {accessory.clientRef && (
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="text-xs text-slate-500 uppercase font-bold mb-1">
                  Ref Client
                </div>
                <div className="text-slate-200">{accessory.clientRef}</div>
              </div>
            )}

            {accessory.capotAngle && (
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="text-xs text-slate-500 uppercase font-bold mb-1">
                  Capot Angle
                </div>
                <div className="text-blue-400">{accessory.capotAngle}</div>
              </div>
            )}

            {accessory.clipColor && (
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="text-xs text-slate-500 uppercase font-bold mb-1">
                  Clip Color
                </div>
                <div className="text-emerald-400">{accessory.clipColor}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <TransactionBar
        onRemove={() => onTransaction("OUT", accessory.id)}
        onAdd={() => onTransaction("IN", accessory.id)}
      />
    </div>
  );
};
