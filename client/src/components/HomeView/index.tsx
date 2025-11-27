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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { suggestions } = useSuggestions(
    searchQuery,
    wrapperRef,
    setShowSuggestions
  );

  const handleSuggestionClick = (suggestion: suggestion) => {
    setSearchQuery(suggestion.id);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputFocus = () => {
    // Re-show suggestions when focusing the input, even if there was an exact match before
    if (searchQuery.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Reset selected index when suggestions change
  React.useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

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
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
          />

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <SuggestionsList
              suggestions={suggestions}
              handleSuggestionClick={handleSuggestionClick}
              selectedIndex={selectedIndex}
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
