import React from "react";
import { Minus, Plus } from "lucide-react";
import { Accessory } from "../../../types";
import { InventoryListItem } from "../../common/InventoryListItem";

interface Props {
  accessory: Accessory;
  stock: number;
  onInspect: (id: string) => void;
  onTransaction: (type: "IN" | "OUT", id: string) => void;
}

export const AccessoryItem: React.FC<Props> = ({
  accessory,
  stock,
  onInspect,
  onTransaction,
}) => {
  return (
    <InventoryListItem
      interactive={false}
      left={
        <div
          onClick={() => onInspect(accessory.id)}
          className="cursor-pointer flex-1"
        >
          <div className="flex-1">
            <div className="text-sm text-slate-400">
              Type: <span className="text-slate-200">{accessory.type}</span>
            </div>
            <div className="text-sm text-slate-500 mt-1 space-y-1">
              <p>Ref: {accessory.clientRef || "N/A"}</p>
              {accessory.capotAngle && (
                <p className="text-blue-400">Angle: {accessory.capotAngle}</p>
              )}
              {accessory.clipColor && (
                <p className="text-emerald-400">Color: {accessory.clipColor}</p>
              )}
            </div>
          </div>
        </div>
      }
      right={
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTransaction("OUT", accessory.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-mono text-lg font-bold text-slate-200">
            {stock}
          </span>
          <button
            onClick={() => onTransaction("IN", accessory.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      }
    />
  );
};
