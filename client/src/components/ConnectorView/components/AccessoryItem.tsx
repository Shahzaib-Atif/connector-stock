import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { InventoryListItem } from "../../common/InventoryListItem";
import { API } from "@/utils/api";
import { TransactionOpenOptions } from "@/utils/types/transactionTypes";
import { AccessoryDto } from "@shared/dto/AccessoryDto";

interface Props {
  accessory: AccessoryDto;
  stock: number;
  onInspect: (id: number) => void;
  onTransaction: (txOptions: TransactionOpenOptions) => void;
}

export const AccessoryItem: React.FC<Props> = ({
  accessory,
  stock,
  onInspect,
  onTransaction,
}) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = API.accessoryImages(accessory.Id);

  return (
    <InventoryListItem
      interactive={false}
      left={
        <div
          onClick={() => onInspect(accessory.Id)}
          className="cursor-pointer flex items-center gap-3 flex-1"
        >
          {/* Thumbnail */}
          {!imageError ? (
            <img
              src={imageUrl}
              alt={accessory.customId}
              className={`w-12 h-12 rounded-lg object-cover border ${
                stock > 0 ? "border-blue-500/20" : "border-red-500/20"
              }`}
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border ${
                stock > 0
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
            />
          )}

          {/* Info */}
          <div className="flex-1">
            <div className="text-slate-400">
              Type:{" "}
              <span className="text-slate-200">
                {accessory.AccessoryType?.toLowerCase()}
              </span>
            </div>
            <div className="text-slate-400 mt-1 space-y-1">
              <p>Ref: {accessory.RefClient || "N/A"}</p>
              {accessory.CapotAngle && (
                <p className="text-blue-400">Angle: {accessory.CapotAngle}</p>
              )}
              {accessory.ClipColor && (
                <p className="text-emerald-400">Color: {accessory.ClipColor}</p>
              )}
            </div>
          </div>
        </div>
      }
      right={
        accessory?.AccessoryType?.toUpperCase() !== "MIOLO" && (
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() =>
                onTransaction({
                  transactionType: "OUT",
                  itemType: "accessory",
                  targetId: accessory.Id,
                })
              }
              disabled={stock <= 0}
              className={`${stockBtnClass} ${
                stock <= 0
                  ? "btn-secondary cursor-not-allowed"
                  : "btn-secondary"
              }`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 sm:w-12 text-center font-mono text-lg sm:text-xl font-bold text-slate-200">
              {stock}
            </span>
            <button
              onClick={() =>
                onTransaction({
                  transactionType: "IN",
                  itemType: "accessory",
                  targetId: accessory.Id,
                })
              }
              className={`${stockBtnClass} btn-primary`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )
      }
    />
  );
};

const stockBtnClass =
  "w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg transition-colors";
