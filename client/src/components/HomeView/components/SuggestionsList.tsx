import { suggestion } from "@/types";
import { Box, Zap } from "lucide-react";

interface Props {
  suggestions: suggestion[];
  handleSuggestionClick: (suggestion: suggestion) => void;
}

function SuggestionsList({ suggestions, handleSuggestionClick }: Props) {
  return (
    <div className="absolute z-50 w-full mt-2 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-y-auto max-h-60 md:max-h-80">
      {suggestions.map((suggestion) => (
        <button
          key={`${suggestion.type}-${suggestion.id}`}
          type="button"
          onClick={() => handleSuggestionClick(suggestion)}
          className="w-full px-4 py-3 text-left hover:bg-slate-700 flex items-center gap-3 transition-colors border-b border-slate-700 last:border-0"
        >
          <div
            className={`p-2 rounded-lg ${
              suggestion.type === "box"
                ? "bg-purple-500/20 text-purple-400"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            {suggestion.type === "box" ? (
              <Box className="w-4 h-4" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="font-semibold text-white font-mono">
              {suggestion.id}
            </div>
            <div className="text-xs text-slate-400 capitalize">
              {suggestion.type}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default SuggestionsList;
