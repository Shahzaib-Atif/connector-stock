import React, { useState } from 'react';
import { Scan, Box as BoxIcon, CircuitBoard, Search, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';

interface HomeViewProps {
  onScan: (code: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onScan }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white relative">
      
      <button onClick={() => dispatch(logout())} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white flex items-center gap-2">
        <span className="text-sm font-mono">{user}</span>
        <LogOut className="w-5 h-5" />
      </button>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30 mb-6">
            <Scan className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Connector Stock</h1>
          <p className="text-slate-400">Scan QR code for Box, Connector, or Accessory</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/10 flex items-center shadow-inner">
          <input 
            type="text" 
            className="bg-transparent border-none outline-none text-white placeholder-slate-400 px-4 py-3 flex-1 font-mono text-lg uppercase"
            placeholder="SCAN or TYPE ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onScan(searchQuery)}
          />
          <button 
            onClick={() => onScan(searchQuery)}
            className="bg-blue-500 hover:bg-blue-400 text-white p-3 rounded-xl transition-colors"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-8">
          <button onClick={() => onScan("A255")} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition text-left group">
            <div className="text-indigo-400 mb-2 group-hover:scale-110 transition-transform origin-left"><BoxIcon /></div>
            <div className="font-semibold text-slate-200">Box A255</div>
            <div className="text-xs text-slate-500">PosId Lookup</div>
          </button>
          <button onClick={() => onScan("A255PR")} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition text-left group">
            <div className="text-emerald-400 mb-2 group-hover:scale-110 transition-transform origin-left"><CircuitBoard /></div>
            <div className="font-semibold text-slate-200">Part A255PR</div>
            <div className="text-xs text-slate-500">Direct Part Lookup</div>
          </button>
        </div>
      </div>
    </div>
  );
};
