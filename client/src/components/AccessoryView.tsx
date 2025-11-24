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

const accessoryResolver: EntityResolver<Accessory> = (
  accessoryId,
  { stockCache }
) => {
  if (!accessoryId.includes("_")) return null;
  return parseAccessory(accessoryId, stockCache);
};

export const AccessoryView: React.FC<AccessoryViewProps> = ({
  onTransaction,
  onOpenQR,
}) => {
  // Shared loader keeps this screen layout-focused.
  const { entity: accessory, stockCache } =
    useEntityDetails<Accessory>(accessoryResolver);
  const { goBack } = useInventoryNavigation();

  if (!accessory) return <div>Accessory not found</div>;

  // Cached stock preferred with parsed fallback.
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
          <h2 className="text-4xl font-bold text-white">{currentStock}</h2>
          <p className="text-slate-400 font-medium mt-1">Units Available</p>
        </div>
      </div>

      <TransactionBar
        onRemove={() => onTransaction("OUT", accessory.id)}
        onAdd={() => onTransaction("IN", accessory.id)}
      />
    </div>
  );
};
