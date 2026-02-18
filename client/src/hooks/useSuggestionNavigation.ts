import { suggestion } from "@/utils/types/shared";
import { useState } from "react";

export function useSuggestionNavigation(
  suggestions: suggestion[],
  showSuggestions: boolean,
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>,
  handleSuggestionClick: (suggestion: suggestion) => void,
  searchQuery: string,
  setSearchQuery: (query: string) => void
) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [originalQuery, setOriginalQuery] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const nextIndex = prev < suggestions.length - 1 ? prev + 1 : prev;
          if (prev === -1) setOriginalQuery(searchQuery);
          setSearchQuery(suggestions[nextIndex].id);
          return nextIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const nextIndex = prev > 0 ? prev - 1 : -1;
          if (nextIndex === -1) {
            setSearchQuery(originalQuery);
          } else {
            setSearchQuery(suggestions[nextIndex].id);
          }
          return nextIndex;
        });
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
        if (selectedIndex !== -1) setSearchQuery(originalQuery);
        break;
    }
  };

  return { handleKeyDown, selectedIndex, setSelectedIndex };
}
