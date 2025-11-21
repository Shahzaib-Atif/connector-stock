import React from "react";
import {
  ArrowRight,
  MapPin,
  Wrench,
  Box as BoxIcon,
  QrCode,
  Users,
  Minus,
  Plus,
} from "lucide-react";
import { Connector } from "../types";
import { parseConnector } from "../services/inventoryService";
import { CollapsibleSection } from "./CollapsibleSection";
import { InsightCard } from "./InsightCard";
import { DetailHeader } from "./DetailHeader";
import { TransactionBar } from "./TransactionBar";
import { InventoryListItem } from "./InventoryListItem";
import { useInventoryNavigation } from "../hooks/useInventoryNavigation";
import {
  useEntityDetails,
  EntityResolver,
} from "../hooks/useEntityDetails";
import { resolveLiveStock } from "../utils/stock";

interface ConnectorViewProps {
  onTransaction: (type: "IN" | "OUT", id?: string) => void;
  onOpenQR: (id: string) => void;
}

const connectorResolver: EntityResolver<Connector> = (connectorId, { stockCache }) => {
  if (connectorId.length !== 6) return null;
  return parseConnector(connectorId, stockCache);
};

export const ConnectorView: React.FC<ConnectorViewProps> = ({
  onTransaction,
  onOpenQR,
}) => {
  // Shared hook lifts params and cache plumbing.
  const { entity: connector, stockCache } =
    useEntityDetails<Connector>(connectorResolver);
  const { goBack, goToAccessory, goToBox } = useInventoryNavigation();

  if (!connector) return <div>Connector not found</div>;

  // Prefer cached quantity with parsed fallback.
  const currentStock = resolveLiveStock(
    stockCache,
    connector.id,
    connector.stock
  );

  const handleAccessoryScan = (accessoryId: string) => {
    goToAccessory(accessoryId);
  };

  const handleBoxScan = (boxId: string) => {
    goToBox(boxId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 pb-32 text-slate-200">
      <DetailHeader
        label="Connector"
        title={connector.id}
        onBack={goBack}
        rightSlot={
          <button
            onClick={() => onOpenQR(connector.id)}
            className="p-2 -mr-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg"
            aria-label="Show connector QR"
          >
            <QrCode className="w-6 h-6" />
          </button>
        }
      />

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <div className="bg-slate-800/50 rounded-2xl p-6 shadow-lg border border-slate-700">
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

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="text-xs text-slate-500 uppercase font-bold mb-1">
                Color
              </div>
              <div className="font-semibold text-slate-200 flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full bg-current shadow-sm"
                  style={{ color: connector.colorName.toLowerCase() }}
                ></span>
                {connector.colorName}
              </div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="text-xs text-slate-500 uppercase font-bold mb-1">
                Vias
              </div>
              <div className="font-semibold text-slate-200">
                {connector.viasName}
              </div>
            </div>
          </div>

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

          <InsightCard connector={connector} />
        </div>

        {connector.accessories.length > 0 && (
          <CollapsibleSection
            title="Associated Accessories"
            icon={<Wrench className="w-4 h-4" />}
            count={connector.accessories.length}
          >
            {connector.accessories.map((acc) => {
              return (
                <InventoryListItem
                  key={acc.id}
                  interactive={false}
                  left={
                    <div
                      onClick={() => handleAccessoryScan(acc.id)}
                      className="cursor-pointer flex-1"
                    >
                      <div className="font-semibold text-slate-200">
                        {acc.type}
                      </div>
                      <div className="font-mono text-xs text-slate-500">
                        {acc.id}
                      </div>
                    </div>
                  }
                  right={
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-slate-300 w-8 text-center">
                        {resolveLiveStock(stockCache, acc.id, acc.stock)}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onTransaction("OUT", acc.id)}
                          className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onTransaction("IN", acc.id)}
                          className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-green-500/20 text-slate-400 hover:text-green-400 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  }
                />
              );
            })}
          </CollapsibleSection>
        )}

        <button
          onClick={() => handleBoxScan(connector.posId)}
          className="w-full p-4 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between group hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-700 text-slate-300 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BoxIcon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-200">
                View Box {connector.posId}
              </div>
              <div className="text-xs text-slate-500">
                See all items in this location
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400" />
        </button>
      </div>

      <TransactionBar
        onRemove={() => onTransaction("OUT", connector.id)}
        onAdd={() => onTransaction("IN", connector.id)}
      />
    </div>
  );
};
