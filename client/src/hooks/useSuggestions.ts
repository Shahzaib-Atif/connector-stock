import { useAppSelector } from "@/store/hooks";
import { suggestion } from "@/types";
import { useEffect, useState } from "react";

export function useSuggestions(
  searchQuery: string,
  setShowSuggestions: (value: React.SetStateAction<boolean>) => void
) {
  const masterData = useAppSelector((state) => state.masterData.data);
  const [suggestions, setSuggestions] = useState<suggestion[]>([]);

  useEffect(() => {
    if (!searchQuery.trim() || !masterData) {
      setSuggestions([]);
      return;
    }

    const query = searchQuery.trim().toUpperCase();
    const newSuggestions: suggestion[] = [];

    // Check for exact match first
    const isExactBoxMatch = masterData.positions && masterData.positions[query];
    const isExactConnectorMatch =
      masterData.connectors && masterData.connectors[query];
    const isExactAccessoryMatch =
      masterData.accessories &&
      Object.keys(masterData.accessories).some(
        (key) => key.toUpperCase() === query
      );

    // Boxes
    if (masterData.positions) {
      const boxMatches = Object.keys(masterData.positions)
        .filter((id) => id.toUpperCase().includes(query))
        .slice(0, 5)
        .map((id) => ({ id, type: "box" as const }));
      newSuggestions.push(...boxMatches);
    }

    // Connectors
    if (masterData.connectors) {
      const connectorMatches = Object.keys(masterData.connectors)
        .filter((id) => id.toUpperCase().includes(query))
        .slice(0, 5)
        .map((id) => ({ id, type: "connector" as const }));
      newSuggestions.push(...connectorMatches);
    }

    // Accessories (by RefClient)
    if (masterData.accessories) {
      const accessoryMatches = Object.keys(masterData.accessories)
        .filter((key) => key.toUpperCase().includes(query))
        .slice(0, 5)
        .map((key) => ({
          id: key,
          type: "accessory" as const,
        }));
      newSuggestions.push(...accessoryMatches);
    }

    // Sort by ID naturally (A0, A1, B0…)
    newSuggestions.sort((a, b) =>
      a.id.localeCompare(b.id, undefined, { numeric: true })
    );

    setSuggestions(newSuggestions);

    // Only auto-hide if it's an exact match AND there's only one suggestion
    // This allows showing multiple connectors even if the box ID is an exact match
    const hasOnlyExactMatch =
      (isExactBoxMatch || isExactConnectorMatch || isExactAccessoryMatch) &&
      newSuggestions.length === 1;

    if (hasOnlyExactMatch) {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(newSuggestions.length > 0);
    }
  }, [searchQuery, masterData]);

  return { suggestions };
}
