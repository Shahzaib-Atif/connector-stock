import React from 'react';
import { ArrowRight, Wrench, QrCode, Plus, Minus } from 'lucide-react';
import { Accessory } from '../types';
import { useAppSelector } from '../store/hooks';

interface AccessoryViewProps {
  accessory: Accessory;
  onBack: () => void;
  onScan: (id: string) => void;
  onOpenQR: () => void;
  onTransaction: (type: 'IN' | 'OUT') => void;
}

export const AccessoryView: React.FC<AccessoryViewProps> = ({
  accessory,
  onBack,
  onScan,
  onOpenQR,
  onTransaction
}) => {
  const stockCache = useAppSelector(state => state.stock.stockCache);
  const currentStock = stockCache[accessory.id] ?? accessory.stock;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 pb-32 text-slate-200">
      <header className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          <ArrowRight className="w-6 h-6 rotate-180" />
        </button>
        <div className="text-center">
           <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Accessory</div>
           <div className="font-mono font-bold text-xl text-white">...{accessory.id.slice(-8)}</div>
        </div>
        <button onClick={onOpenQR} className="p-2 -mr-2 text-slate-400 hover:text-blue-400 transition-colors">
          <QrCode className="w-6 h-6" />
        </button>
      </header>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <div className="bg-slate-800/50 rounded-2xl p-6 shadow-lg border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
              <Wrench className="w-32 h-32" />
          </div>
          <div className="relative z-10">
              <h2 className="text-xl font-bold text-slate-200 mb-1">{accessory.type}</h2>
              <p className="text-slate-500 font-mono text-sm mb-6">{accessory.id}</p>
              
              <div className="flex items-baseline gap-2">
                  <h1 className="text-5xl font-bold text-white">{currentStock}</h1>
                  <span className="text-slate-400 font-medium">in stock</span>
              </div>
          </div>
        </div>

        {/* Parent Details */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
            <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700 font-bold text-slate-500 text-sm uppercase tracking-wider">
                For Connector
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
                <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Connector ID</div>
                    <div 
                      onClick={() => onScan(accessory.connectorId)}
                      className="font-mono text-lg font-bold text-blue-400 cursor-pointer hover:text-blue-300 hover:underline"
                    >
                        {accessory.connectorId}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Client</div>
                    <div className="font-semibold text-slate-200">{accessory.clientName}</div>
                    <div className="text-xs text-slate-500 font-mono">#{accessory.clientRef}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Box / PosID</div>
                    <div 
                      onClick={() => onScan(accessory.posId)}
                      className="font-mono text-lg font-bold text-indigo-400 cursor-pointer hover:text-indigo-300 hover:underline"
                    >
                        {accessory.posId}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 p-4 px-6 pb-6 shadow-2xl z-20 backdrop-blur">
        <div className="max-w-3xl mx-auto flex gap-4">
          <button onClick={() => onTransaction('OUT')} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
            <Minus className="w-5 h-5" /> TAKE OUT
          </button>
          <button onClick={() => onTransaction('IN')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/50">
            <Plus className="w-5 h-5" /> ADD STOCK
          </button>
        </div>
      </div>
    </div>
  );
};