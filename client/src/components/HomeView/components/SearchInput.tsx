import { suggestion } from "@/types";
import { Search } from "lucide-react";

interface Props {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onScan: (code: string) => void;
  scanError: string | null;
  onClearScanError: () => void;
  suggestions: suggestion[];
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
}

function SearchInput({
  searchQuery,
  scanError,
  suggestions,
  setSearchQuery,
  onScan,
  onClearScanError,
  setShowSuggestions,
}: Props) {
  return (
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
  );
}

export default SearchInput;
