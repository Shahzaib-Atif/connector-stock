import React from "react";
import { MapPin, Users } from "lucide-react";
import { Connector } from "../../../types";

interface ConnectorSummaryProps {
  connector: Connector;
  currentStock: number;
}

export const ConnectorSummary: React.FC<ConnectorSummaryProps> = ({
  connector,
  currentStock,
}) => {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 shadow-lg border border-slate-700">
      {/* Stock Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-4xl font-bold text-white">{currentStock}</h2>
          <p className="text-slate-400 font-medium mt-1">Units Available</p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-xs font-bold border border-blue-500/20">
            <MapPin className="w-3 h-3" />
            {connector.cv} | {connector.ch}
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            POS: {connector.posId}
          </div>
        </div>
      </div>

      {/* Color & Vias */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Color */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <div className="text-xs text-slate-500 uppercase font-bold mb-1">
            Color
          </div>
          <div className="font-semibold text-slate-200 flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full bg-current shadow-sm"
              style={{ color: connector.colorName.split('(')[1]?.replace(')', '').toLowerCase() || 'gray' }}
            ></span>
            color: {connector.colorName}
          </div>
        </div>
        {/* Vias */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <div className="text-xs text-slate-500 uppercase font-bold mb-1">
            Vias
          </div>
          <div className="font-semibold text-slate-200">
            vias: {connector.viasName}
          </div>
        </div>
      </div>

      {/* Client Reference */}
      <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 flex items-center gap-3">
        <div className="p-2 bg-slate-800 rounded-lg text-slate-400 border border-slate-700">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase font-bold">
            Client Reference
          </div>
          <div className="font-semibold text-slate-200">
            {connector.clientName}{" "}
            <span className="text-slate-500 font-normal">
              ({connector.clientRef})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
