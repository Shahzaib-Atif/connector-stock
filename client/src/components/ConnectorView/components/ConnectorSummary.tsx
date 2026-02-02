import React, { useState } from "react";
import { MapPin, Users } from "lucide-react";
import { API } from "@/utils/api";
import ImageBox from "@/components/common/ImageBox";
import StockDiv from "@/components/common/StockDiv";
import CardInfoDiv from "@/components/common/CardInfoDiv";
import { VIEW_SUMMARY_CLASS } from "@/utils/constants";
import { Connector } from "@/utils/types";

interface ConnectorSummaryProps {
  connector: Connector;
}

export const ConnectorSummary: React.FC<ConnectorSummaryProps> = ({
  connector,
}) => {
  const [error, setError] = useState(false);
  const imageUrl = API.connectorImages(connector.CODIVMAC);
  const { PosId, colorName, viasName, Qty, ConnType, details } = connector;
  const { Fabricante, Refabricante, Family, OBS } = details;

  return (
    <div id="connector-summary" className={VIEW_SUMMARY_CLASS}>
      {/* Connector Image (if available) */}
      <ImageBox
        error={error}
        imageUrl={imageUrl}
        handleError={() => setError(true)}
      />
      {/* Stock Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-3">
          <StockDiv currentStock={Qty} />
          
          <div className="flex gap-2.5">
            <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all duration-300 ${
              (connector.Qty_com_fio || 0) > 0 
                ? "bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]" 
                : "bg-slate-800/40 border-slate-700/50 opacity-50"
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                (connector.Qty_com_fio || 0) > 0 ? "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" : "bg-slate-600"
              }`} />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] uppercase text-slate-500 font-black tracking-widest mb-1">With Wires</span>
                <span className={`text-sm font-bold ${(connector.Qty_com_fio || 0) > 0 ? "text-blue-100" : "text-slate-500"}`}>
                  {connector.Qty_com_fio || 0}
                </span>
              </div>
            </div>

            <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all duration-300 ${
              (connector.Qty_sem_fio || 0) > 0 
                ? "bg-indigo-500/10 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]" 
                : "bg-slate-800/40 border-slate-700/50 opacity-50"
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                (connector.Qty_sem_fio || 0) > 0 ? "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" : "bg-slate-600"
              }`} />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] uppercase text-slate-500 font-black tracking-widest mb-1">No Wires</span>
                <span className={`text-sm font-bold ${(connector.Qty_sem_fio || 0) > 0 ? "text-indigo-100" : "text-slate-500"}`}>
                  {connector.Qty_sem_fio || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id="connector-position" className="flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 bg-blue-500/10 text-blue-300 rounded-full text-xs sm:text-sm font-bold border border-blue-500/20">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
            {connector.cv} | {connector.ch}
          </div>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500 font-mono">
            POS: {PosId}
          </div>
        </div>
      </div>

      {/* Color, Vias, Type, Family */}
      <div
        id="connector-metadata-1"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4"
      >
        <CardInfoDiv label="Color" value={colorName} />
        <CardInfoDiv label="Vias" value={viasName} />
        <CardInfoDiv label="Type" value={ConnType} />
        <CardInfoDiv label="Family" value={Family?.toString() || "-"} />
      </div>

      {/* Fabricante, Refabricante, Obs */}
      <div
        id="connector-metadata-2"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4"
      >
        <CardInfoDiv label="Fabricante" value={Fabricante || "--"} />
        <CardInfoDiv label="Refabricante" value={Refabricante || "--"} />
        {OBS && (
          <CardInfoDiv
            classnames="col-span-2"
            label="Obs."
            value={OBS || "-"}
          />
        )}
      </div>

      {/* Client References */}
      {connector.clientReferences && connector.clientReferences.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2 mb-3 text-slate-400">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              RefMARCA
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {connector.clientReferences.map((ref, index) => (
              <div
                key={index}
                className="px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 font-medium"
              >
                {ref}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
