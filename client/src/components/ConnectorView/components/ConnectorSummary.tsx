import React, { useEffect, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  let timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  const imageUrl = `${API_BASE_URL}/images/${connector.id}`;

  useEffect(() => {
    setLoading(true);
    setImageError(false);

    timeoutRef.current = setTimeout(() => {
      setImageError(true);
      setLoading(false);
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [imageUrl]);

  const handleImgLoad = () => {
    setLoading(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 shadow-lg border border-slate-700">
      {/* Connector Image (if available) */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-sm aspect-video bg-slate-900/80 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
          <img
            src={imageUrl}
            alt={`Connector ${connector.id}`}
            className="w-full h-full object-contain"
            onLoad={handleImgLoad}
            onError={() => setImageError(true)}
          />
        </div>
      </div>

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
      {/* Color, Vias & Type */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Color */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <div className="text-xs text-slate-500 uppercase font-bold mb-1">
            Color
          </div>
          <div className="font-semibold text-slate-200 flex items-center gap-2">
            {connector.colorName}
          </div>
        </div>
        {/* Vias */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <div className="text-xs text-slate-500 uppercase font-bold mb-1">
            Vias
          </div>
          <div className="font-semibold text-slate-200">
            {connector.viasName}
          </div>
        </div>
        {/* Type */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <div className="text-xs text-slate-500 uppercase font-bold mb-1">
            Type
          </div>
          <div className="font-semibold text-slate-200">{connector.type}</div>
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
