import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, CircuitBoard, Wrench, QrCode } from "lucide-react";
import { useAppSelector } from "../store/hooks";
import { getBoxDetails } from "../services/inventoryService";
import { CollapsibleSection } from "./CollapsibleSection";

interface BoxViewProps {
  onOpenQR: (id: string) => void;
}

export const BoxView: React.FC<BoxViewProps> = ({ onOpenQR }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const stockCache = useAppSelector((state) => state.stock.stockCache);

  if (!id) return <div>Box not found</div>;

  const box = getBoxDetails(id);
  if (!box) return <div>Box not found</div>;

  const handleConnectorScan = (connectorId: string) => {
    navigate(`/connector/${connectorId}`);
  };

  const handleAccessoryScan = (accessoryId: string) => {
    navigate(`/accessory/${accessoryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 pb-12 text-slate-200">
      <header className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
        >
          <ArrowRight className="w-6 h-6 rotate-180" />
        </button>
        <div className="text-center">
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Box Storage
          </div>
          <div className="font-mono font-bold text-xl text-white">{box.id}</div>
        </div>
        <button
          onClick={() => onOpenQR(box.id)}
          className="p-2 -mr-2 text-slate-400 hover:text-blue-400 transition-colors"
        >
          <QrCode className="w-6 h-6" />
        </button>
      </header>

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg border border-orange-500/20">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase">
                Physical Coordinates
              </div>
              <div className="font-mono font-bold text-white text-lg">
                {box.cv} <span className="text-slate-600">/</span> {box.ch}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {box.connectors.length + box.accessories.length}
            </div>
            <div className="text-xs text-slate-500">Total Items</div>
          </div>
        </div>

        <CollapsibleSection
          title="Connectors"
          icon={<CircuitBoard className="w-4 h-4" />}
          count={box.connectors.length}
          defaultOpen={true}
        >
          {box.connectors.map((conn) => {
            const liveStock = stockCache[conn.id] ?? conn.stock;
            return (
              <div
                key={conn.id}
                onClick={() => handleConnectorScan(conn.id)}
                className="bg-slate-800 p-4 rounded-xl border border-slate-700/50 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-500/50 hover:bg-slate-700/50 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border ${
                      liveStock > 0
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    {conn.viasCode}
                  </div>
                  <div>
                    <div className="font-mono font-bold text-white text-lg">
                      {conn.id}
                    </div>
                    <div className="text-sm text-slate-400">
                      {conn.colorName} • {conn.viasName}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white text-xl">
                    {liveStock}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">
                    Stock
                  </div>
                </div>
              </div>
            );
          })}
        </CollapsibleSection>

        {box.accessories.length > 0 && (
          <CollapsibleSection
            title="Accessories"
            icon={<Wrench className="w-4 h-4" />}
            count={box.accessories.length}
            defaultOpen={false}
          >
            {box.accessories.map((acc) => {
              const liveStock = stockCache[acc.id] ?? acc.stock;
              return (
                <div
                  key={acc.id}
                  onClick={() => handleAccessoryScan(acc.id)}
                  className="bg-slate-800 p-4 rounded-xl border border-slate-700/50 shadow-sm flex items-center justify-between cursor-pointer hover:border-indigo-500/50 hover:bg-slate-700/50 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{acc.type}</div>
                      <div className="text-xs font-mono text-slate-400">
                        For {acc.connectorId}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white text-xl">
                      {liveStock}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase">
                      Stock
                    </div>
                  </div>
                </div>
              );
            })}
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
};
