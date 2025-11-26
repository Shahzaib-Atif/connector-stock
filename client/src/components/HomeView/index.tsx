import React, { useState, useEffect, useRef } from "react";
import { Scan, Search, AlertTriangle, Box, Zap } from "lucide-react";
import { useAppSelector } from "../../store/hooks";
import ExampleLookup from "../ExampleLookup";
import HeaderBar from "./components/HeaderBar";
import { suggestion } from "@/types";
import SearchInput from "./components/SearchInput";
import SuggestionsList from "./components/SuggestionsList";
import { useSuggestions } from "@/hooks/useSuggestions";
import ErrorBox from "./components/ErrorBox";

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { suggestions } = useSuggestions(
    searchQuery,
    wrapperRef,
    setShowSuggestions
  );

  const handleSuggestionClick = (suggestion: {
    id: string;
    type: "box" | "connector";
  }) => {
    setSearchQuery(suggestion.id);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white relative">
      <HeaderBar />

      <div className="w-full max-w-md space-y-8">
        {/* Title and description */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30 mb-6">
            <Scan className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Connector Stock</h1>
          <p className="text-slate-400">Search for Box or Connector by ID</p>
        </div>

        {/* Search */}
        <div className="relative" ref={wrapperRef}>
          <SearchInput
            searchQuery={searchQuery}
            scanError={scanError}
            suggestions={suggestions}
            onClearScanError={onClearScanError}
            onScan={onScan}
            setSearchQuery={setSearchQuery}
            setShowSuggestions={setShowSuggestions}
          />

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <SuggestionsList
              suggestions={suggestions}
              handleSuggestionClick={handleSuggestionClick}
            />
          )}
        </div>

        {/* ERROR Alert */}
        {scanError && <ErrorBox scanError={scanError} />}

        {/* EXAMPLE */}
        <ExampleLookup onScan={onScan} />
      </div>
    </div>
  );
};
