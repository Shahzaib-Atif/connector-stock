import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, QrCode, Plus, Minus } from "lucide-react";
import { useAppSelector } from "../store/hooks";
import { parseAccessory } from "../services/inventoryService";

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
      <header className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
        >
          <ArrowRight className="w-6 h-6 rotate-180" />
        </button>
        <div className="text-center">
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Accessory
          </div>
          <div className="font-mono font-bold text-xl text-white">
            {accessory.id}
          </div>
        </div>
        <button
          onClick={() => onOpenQR(accessory.id)}
          className="p-2 -mr-2 text-slate-400 hover:text-blue-400 transition-colors"
        >
          <QrCode className="w-6 h-6" />
        </button>
      </header>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <div className="bg-slate-800/50 rounded-2xl p-6 shadow-lg border border-slate-700">
          <h2 className="text-4xl font-bold text-white">{currentStock}</h2>
          <p className="text-slate-400 font-medium mt-1">Units Available</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 p-4 px-6 pb-6 shadow-2xl z-20 backdrop-blur">
        <div className="max-w-3xl mx-auto flex gap-4">
          <button
            onClick={() => onTransaction("OUT", accessory.id)}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Minus className="w-5 h-5" /> TAKE OUT
          </button>
          <button
            onClick={() => onTransaction("IN", accessory.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/50"
          >
            <Plus className="w-5 h-5" /> ADD STOCK
          </button>
        </div>
      </div>
    </div>
  );
};
