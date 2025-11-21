import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QrCode } from "lucide-react";
import { useAppSelector } from "../store/hooks";
import { parseAccessory } from "../services/inventoryService";
import { DetailHeader } from "./DetailHeader";
import { TransactionBar } from "./TransactionBar";

interface AccessoryViewProps {
  onTransaction: (type: "IN" | "OUT", id?: string) => void;
  onOpenQR: (id: string) => void;
}

export const AccessoryView: React.FC<AccessoryViewProps> = ({
  onTransaction,
  onOpenQR,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const stockCache = useAppSelector((state) => state.stock.stockCache);

  if (!id) return <div>Accessory not found</div>;

  const accessory = parseAccessory(id, stockCache);
  if (!accessory) return <div>Accessory not found</div>;

  const currentStock = stockCache[accessory.id] ?? accessory.stock;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 pb-32 text-slate-200">
      <DetailHeader
        label="Accessory"
        title={accessory.id}
        onBack={() => navigate(-1)}
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
