import { suggestion } from "@/utils/types/types";
import { Box, Zap, Wrench } from "lucide-react";

interface Props {
  suggestions: suggestion[];
  handleSuggestionClick: (suggestion: suggestion) => void;
  selectedIndex?: number;
}

function SuggestionsList({
  suggestions,
  handleSuggestionClick,
  selectedIndex = -1,
}: Props) {
  const getIconConfig = (type: suggestion["type"]) => {
    switch (type) {
      case "box":
        return {
          icon: <Box className="w-4 h-4" />,
          className: "bg-purple-500/20 text-purple-400",
        };
      case "connector":
        return {
          icon: <Zap className="w-4 h-4" />,
          className: "bg-blue-500/20 text-blue-400",
        };
      case "accessory":
        return {
          icon: <Wrench className="w-4 h-4" />,
          className: "bg-green-500/20 text-green-400",
        };
      default:
        return {
          icon: <Zap className="w-3 h-3" />,
          className: "bg-blue-500/20 text-blue-300",
        };
    }
  };

  return (
    <div className="absolute z-50 w-full mt-2 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-y-auto max-h-60 md:max-h-80">
      {suggestions.map((suggestion, index) => {
        const iconConfig = getIconConfig(suggestion.type);
        const isSelected = index === selectedIndex;
        return (
          <button
            key={`${suggestion.type}-${suggestion.id}`}
            type="button"
            onClick={() => handleSuggestionClick(suggestion)}
            className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-b border-slate-700 last:border-0 ${
              isSelected
                ? "bg-blue-600/30 hover:bg-blue-600/40"
                : "hover:bg-slate-700"
            }`}
          >
            <div className={`p-2 rounded-lg ${iconConfig.className}`}>
              {iconConfig.icon}
            </div>
            <div>
              <div className="text-mono text-sm">{suggestion.id}</div>
              {suggestion.type && (
                <div className="text-xs text-slate-400 capitalize">
                  {suggestion.type}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default SuggestionsList;
