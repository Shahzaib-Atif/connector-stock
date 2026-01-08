import React from "react";
import { Accessory } from "@/utils/types/types";

interface Props {
  selectedAccessoryIds: string[];
  associatedAccessories: Accessory[];
  setSelectedAccessoryIds: React.Dispatch<React.SetStateAction<string[]>>;
  transactionType?: "IN" | "OUT";
}

function AccessoryChecklist({
  selectedAccessoryIds,
  associatedAccessories,
  setSelectedAccessoryIds,
  transactionType,
}: Props) {
  if (associatedAccessories.length === 0) return null;

  const toggle = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.checked) {
      setSelectedAccessoryIds((prev) => [...prev, id]);
    } else {
      setSelectedAccessoryIds((prev) => prev.filter((accId) => accId !== id));
    }
  };

  return (
    <div className="bg-slate-700/50 p-4 rounded-xl space-y-3">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
        Associated Accessories
      </h3>
      <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
        {associatedAccessories.map((acc) => {
          const isOutOfStock = transactionType === "OUT" && acc.Qty <= 0;
          return (
            <label
              key={acc.id}
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                isOutOfStock
                  ? "opacity-50 cursor-not-allowed bg-slate-800/50"
                  : "hover:bg-slate-700 cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedAccessoryIds.includes(acc.id)}
                onChange={(e) => toggle(e, acc.id)}
                disabled={isOutOfStock}
                className="w-5 h-5 rounded border-slate-500 text-blue-600 focus:ring-blue-500 bg-slate-800 disabled:opacity-50"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-200">
                    {acc.RefClient || acc.id}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      acc.Qty > 0
                        ? "text-slate-400 bg-slate-800"
                        : "text-red-400 bg-red-950/30"
                    }`}
                  >
                    Qty: {acc.Qty}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {acc.AccessoryType}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default AccessoryChecklist;
