import { Accessory } from "@/types";
import React from "react";

interface Props {
  accessory: Accessory;
}

function AccessoryDetailsCard({ accessory }: Props) {
  return (
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
        <div className="text-slate-200 font-mono">{accessory.connectorId}</div>
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
  );
}

export default AccessoryDetailsCard;
