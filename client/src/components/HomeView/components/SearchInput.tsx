import { suggestion } from "@/utils/types/shared";
import { Search } from "lucide-react";

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
}: // onOpenScanner,
Props) {
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
        id="home-search-input"
        type="text"
        className={inputClass1}
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          if (scanError) onClearScanError();
        }}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        autoComplete="off"
      />

      {/* Search Btn */}
      <button
        id="general-search-btn"
        onClick={() => onScan(searchQuery)}
        className={btnClass1}
        title="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Open scanner btn */}
      {/* {onOpenScanner && (
        <button
          id="open-scanner-btn"
          onClick={onOpenScanner}
          className={btnClass1 + "ml-1 sm:ml-1.5 "}
          title="Scan with Camera"
        >
          <ScanLine className="w-5 h-5" />
        </button>
      )} */}
    </div>
  );
}

export default SearchInput;

const inputClass1 =
  "bg-transparent border-none outline-none text-white placeholder-slate-400 p-2 " +
  "sm:px-4 sm:py-3 min-w-0 flex-1 font-mono text-base sm:text-lg uppercase";

const btnClass1 =
  "btn-primary p-2 sm:p-3 rounded-xl transition-colors flex-shrink-0 ";
