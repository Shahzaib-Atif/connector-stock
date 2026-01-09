import { suggestion } from "@/utils/types/shared";
import { useState } from "react";

export function useSuggestionNavigation(
  suggestions: suggestion[],
  showSuggestions: boolean,
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>,
  handleSuggestionClick: (suggestion: suggestion) => void
) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

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

  return { handleKeyDown, selectedIndex, setSelectedIndex };
}
