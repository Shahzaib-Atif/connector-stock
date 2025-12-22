import { suggestion } from "@/types";
import { Search, ScanLine } from "lucide-react";

interface Props {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onScan: (code: string) => void;
  scanError: string | null;
  onClearScanError: () => void;
  suggestions: suggestion[];
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onOpenScanner?: () => void;
}

function SearchInput({
  searchQuery,
  scanError,
  suggestions,
  setSearchQuery,
  onScan,
  onClearScanError,
  setShowSuggestions,
  onKeyDown,
  onFocus,
  onOpenScanner,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Call parent handler first for navigation
    if (onKeyDown) {
      onKeyDown(e);
    }
    // Only trigger scan on Enter if not handled by parent (no suggestions)
    if (e.key === "Enter" && !e.defaultPrevented) {
      onScan(searchQuery);
    }
  };

  const handleFocus = () => {
    // Call parent handler first
    if (onFocus) {
      onFocus();
    }
    // Fallback behavior if no parent handler
    else if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/10 flex items-center shadow-inner overflow-hidden">
      <input
        type="text"
        className="bg-transparent border-none outline-none text-white placeholder-slate-400 px-2 sm:px-4 py-3 min-w-0 flex-1 font-mono text-base sm:text-lg uppercase"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          if (scanError) onClearScanError();
        }}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
      />
      <button
        onClick={() => onScan(searchQuery)}
        className="btn-primary p-2.5 sm:p-3 rounded-xl transition-colors flex-shrink-0"
      >
        <Search className="w-5 h-5 sm:w-6 h-6" />
      </button>

      {onOpenScanner && (
        <button
          onClick={onOpenScanner}
          className="p-2 sm:p-3 text-slate-400 hover:text-blue-400 transition-colors ml-0.5 sm:ml-1 flex-shrink-0"
          title="Scan with Camera"
        >
          <ScanLine className="w-5 h-5 sm:w-6 h-6" />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
