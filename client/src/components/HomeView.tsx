import React, { useState, useEffect, useRef } from "react";
import { Scan, Search, LogOut, AlertTriangle, Box, Zap } from "lucide-react";
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
  const [suggestions, setSuggestions] = useState<{ id: string; type: 'box' | 'connector' }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const masterData = useAppSelector((state) => state.stock.masterData);

  useEffect(() => {
    // Close suggestions when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (!searchQuery.trim() || !masterData) {
      setSuggestions([]);
      return;
    }

    const query = searchQuery.trim().toUpperCase();
    const newSuggestions: { id: string; type: 'box' | 'connector' }[] = [];

    // 1. Search Boxes (Positions)
    if (masterData.positions) {
      const boxMatches = Object.keys(masterData.positions)
        .filter(id => id.toUpperCase().includes(query))
        .slice(0, 5)
        .map(id => ({ id, type: 'box' as const }));
      newSuggestions.push(...boxMatches);
    }

    // 2. Search Connectors (References)
    if (masterData.references) {
      const connectorMatches = Object.keys(masterData.references)
        .filter(id => id.toUpperCase().includes(query))
        .slice(0, 5)
        .map(id => ({ id, type: 'connector' as const }));
      newSuggestions.push(...connectorMatches);
    }

    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
  }, [searchQuery, masterData]);

  const handleSuggestionClick = (suggestion: { id: string; type: 'box' | 'connector' }) => {
    setSearchQuery(suggestion.id);
    setShowSuggestions(false);
    onScan(suggestion.id);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white relative">
      <a
        href="/"
        className="absolute top-3 left-6 p-2 text-slate-400 hover:text-white flex items-center gap-2"
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
        className="absolute top-3 right-6 p-2 text-slate-400 hover:text-white flex items-center gap-2"
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
        <div className="relative" ref={wrapperRef}>
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
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
            />
            <button
              onClick={() => onScan(searchQuery)}
              className="btn-primary p-3 rounded-xl transition-colors"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
              {suggestions.map((suggestion) => (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-700 flex items-center gap-3 transition-colors border-b border-slate-700 last:border-0"
                >
                  <div className={`p-2 rounded-lg ${
                    suggestion.type === 'box' 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {suggestion.type === 'box' ? <Box className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-semibold text-white font-mono">{suggestion.id}</div>
                    <div className="text-xs text-slate-400 capitalize">{suggestion.type}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
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
