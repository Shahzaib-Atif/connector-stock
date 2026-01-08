import React from "react";
import { useState } from "react";
import { Accessory } from "@/utils/types/types";
import { API } from "@/utils/api";

interface Props {
  acc: Accessory;
  liveStock: number;
}

function AccessoryInfo({ acc, liveStock }: Props) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = API.accessoryImages(acc.id);

  return (
    <>
      {!imageError ? (
        <img
          src={imageUrl}
          alt={acc.id}
          className={`w-12 h-12 rounded-lg object-cover border ${
            liveStock > 0 ? "border-blue-500/20" : "border-red-500/20"
          }`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border ${
            liveStock > 0
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        />
      )}
      <div>
        <div className="text-white">Conn: {acc.ConnName}</div>
        <div className="text-slate-400 text-sm">
          Type: {acc.AccessoryType?.toLowerCase()}
        </div>
      </div>
    </>
  );
}

export default AccessoryInfo;
