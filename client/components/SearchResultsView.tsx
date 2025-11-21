import React from 'react';
import { Users, CircuitBoard } from 'lucide-react';
import { Connector } from '../types';
import { useAppSelector } from '../store/hooks';
import { DetailHeader } from './DetailHeader';
import { resolveLiveStock } from '../utils/stock';

interface SearchResultsViewProps {
  query: string;
  results: Connector[];
  onBack: () => void;
  onSelect: (connector: Connector) => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({ 
  query, 
  results, 
  onBack, 
  onSelect 
}) => {
  const stockCache = useAppSelector(state => state.stock.stockCache);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 pb-12 text-slate-200">
      <DetailHeader
        label="Search Results"
        title={`REF: ${query}`}
        onBack={onBack}
      />

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <div className="bg-indigo-600/90 rounded-xl p-6 shadow-lg text-white flex items-center gap-4 border border-indigo-500/50">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="w-6 h-6 text-white" />
            </div>
            <div>
                <h2 className="text-lg font-bold">Client Reference Found</h2>
                <p className="text-indigo-100 text-sm">
                   {results.length > 0 ? `Found ${results.length} connectors associated with Client #${query}` : 'No items found'}
                </p>
            </div>
        </div>

        <div className="space-y-3">
            {results.map((conn) => {
                 const liveStock = resolveLiveStock(stockCache, conn.id, conn.stock);
                 return (
                    <button 
                        key={conn.id}
                        onClick={() => onSelect(conn)}
                        className="w-full bg-slate-800/80 p-4 rounded-xl border border-slate-700 shadow-sm flex items-center justify-between hover:border-blue-500/50 hover:bg-slate-700 transition-all text-left group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-900/50 rounded-lg group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors border border-slate-700/50">
                                <CircuitBoard className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
                            </div>
                            <div>
                                <div className="font-mono font-bold text-lg text-white">{conn.id}</div>
                                <div className="text-sm text-slate-400">{conn.description}</div>
                                <div className="text-xs font-semibold text-indigo-400 mt-1">
                                    {conn.clientName} ({conn.clientRef})
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-xl font-bold text-white">{liveStock}</div>
                             <div className="text-[10px] text-slate-500 uppercase font-bold">Stock</div>
                        </div>
                    </button>
                 );
            })}
        </div>
      </div>
    </div>
  );
};