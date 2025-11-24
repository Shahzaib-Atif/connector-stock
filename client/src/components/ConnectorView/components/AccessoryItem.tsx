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
          <div className="font-semibold text-slate-200">{accessory.type}</div>
          <div className="font-mono text-xs text-slate-500">{accessory.id}</div>
        </div>
      }
      right={
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold text-slate-300 w-8 text-center">
            {stock}
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => onTransaction("OUT", accessory.id)}
              className="w-8 h-8 flex items-center justify-center
                bg-slate-700 text-slate-400 rounded-lg transition-colors
                hover:bg-red-500/20 hover:text-red-400"
            >
              <Minus className="w-4 h-4" />
            </button>

            <button
              onClick={() => onTransaction("IN", accessory.id)}
              className="w-8 h-8 flex items-center justify-center
                bg-slate-700 text-slate-400 rounded-lg transition-colors
                hover:bg-green-500/20 hover:text-green-400"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      }
    />
  );
};
