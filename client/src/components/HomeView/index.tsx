import { useState, useRef, useEffect, useCallback } from "react";
import { Scan } from "lucide-react";
import ExampleLookup from "../ExampleLookup";
import { DetailHeader } from "../common/DetailHeader";
import { suggestion } from "@/types";
import SearchInput from "./components/SearchInput";
import SuggestionsList from "./components/SuggestionsList";
import { useSuggestions } from "@/hooks/useSuggestions";
import ErrorBox from "./components/ErrorBox";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useSuggestionNavigation } from "../../hooks/useSuggestionNavigation";
import { useGlobalEnterKey } from "@/hooks/useGlobalEnterKey";

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

  // get suggestions
  const { suggestions } = useSuggestions(searchQuery, setShowSuggestions);

  // Close suggestions when clicking outside
  const handleClickOutside = useCallback(() => {
    setShowSuggestions(false);
  }, []);
  useClickOutside(wrapperRef, handleClickOutside);

  const handleSuggestionClick = (suggestion: suggestion) => {
    setSearchQuery(suggestion.id);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const { handleKeyDown, selectedIndex, setSelectedIndex } =
    useSuggestionNavigation(
      suggestions,
      showSuggestions,
      setShowSuggestions,
      handleSuggestionClick
    );

  const handleInputFocus = () => {
    // Re-show suggestions when focusing the input, even if there was an exact match before
    if (searchQuery.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  // Global Enter key listener - trigger search from anywhere on the page
  useGlobalEnterKey(searchQuery, onScan);

  return (
    <div
      id="home-view"
      className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 to-slate-900 text-white"
    >
      {/* Header */}
      <DetailHeader showQR={false} />

      {/* Main content - centered */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Title and description */}
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30 mb-6">
              <Scan className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Connector Stock</h1>
            <p className="text-slate-400">
              Search for Box, Connector or Client Reference
            </p>
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
    </div>
  );
};
