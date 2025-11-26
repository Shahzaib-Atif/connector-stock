import { useAppSelector } from "@/store/hooks";
import { suggestion } from "@/types";
import { useEffect, useState } from "react";

export function useSuggestions(
  searchQuery: string,
  wrapperRef: React.RefObject<HTMLDivElement>,
  setShowSuggestions: (value: React.SetStateAction<boolean>) => void
) {
  const masterData = useAppSelector((state) => state.stock.masterData);
  const [suggestions, setSuggestions] = useState<suggestion[]>([]);

  useEffect(() => {
    // Close suggestions when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (!searchQuery.trim() || !masterData) {
      setSuggestions([]);
      return;
    }

    const query = searchQuery.trim().toUpperCase();
    const newSuggestions: { id: string; type: "box" | "connector" }[] = [];

    // Check for exact match first
    const isExactBoxMatch = masterData.positions && masterData.positions[query];
    const isExactConnectorMatch =
      masterData.references && masterData.references[query];

    // Don't show suggestions if it's an exact match
    if (isExactBoxMatch || isExactConnectorMatch) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Boxes
    if (masterData.positions) {
      const boxMatches = Object.keys(masterData.positions)
        .filter((id) => id.toUpperCase().includes(query))
        .slice(0, 5)
        .map((id) => ({ id, type: "box" as const }));
      newSuggestions.push(...boxMatches);
    }

    // Connectors
    if (masterData.references) {
      const connectorMatches = Object.keys(masterData.references)
        .filter((id) => id.toUpperCase().includes(query))
        .slice(0, 5)
        .map((id) => ({ id, type: "connector" as const }));
      newSuggestions.push(...connectorMatches);
    }

    // Sort by ID naturally (A0, A1, B0…)
    newSuggestions.sort((a, b) =>
      a.id.localeCompare(b.id, undefined, { numeric: true })
    );

    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
  }, [searchQuery, masterData]);

  return { suggestions };
}
