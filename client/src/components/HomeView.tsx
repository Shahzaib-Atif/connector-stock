import React, { useState } from "react";
import { Scan, Search, LogOut, AlertTriangle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/authSlice";
import ExampleLookup from "./ExampleLookup";

interface HomeViewProps {
  onScan: (code: string) => void;
  scanError: string | null;
  onClearScanError: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onScan,
  scanError,
  onClearScanError,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white relative">
      <a
        href="/"
        className="absolute top-6 left-6 p-2 text-slate-400 hover:text-white flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span className="text-xl font-bold">divmac</span>
      </a>

      <button
        onClick={() => dispatch(logout())}
        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white flex items-center gap-2"
      >
        <span className="text-sm font-mono">{user}</span>
        <LogOut className="w-5 h-5" />
      </button>

      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30 mb-6">
            <Scan className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Connector Stock</h1>
          <p className="text-slate-400">Search for Box or Connector by ID</p>
        </div>

        {/* Search */}
        <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/10 flex items-center shadow-inner">
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white placeholder-slate-400 px-4 py-3 flex-1 font-mono text-lg uppercase"
            placeholder="ENTER BOX or CONNECTOR ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (scanError) onClearScanError();
            }}
            onKeyDown={(e) => e.key === "Enter" && onScan(searchQuery)}
          />
          <button
            onClick={() => onScan(searchQuery)}
            className="bg-blue-500 hover:bg-blue-400 text-white p-3 rounded-xl transition-colors"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>

        {/* ERROR Alert */}
        {scanError && (
          <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-200 text-sm leading-relaxed">
              {scanError}
            </p>
          </div>
        )}

        {/* EXAMPLE */}
        <ExampleLookup onScan={onScan} />
      </div>
    </div>
  );
};
