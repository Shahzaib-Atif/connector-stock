import { useAppSelector } from "@/store/hooks";
import { suggestion } from "@/types";
import { useEffect, useState } from "react";
import { constructAccessoryId } from "@/services/connectorService";

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
    const newSuggestions: suggestion[] = [];

    // Check for exact match first
    const isExactBoxMatch = masterData.positions && masterData.positions[query];
    const isExactConnectorMatch =
      masterData.references && masterData.references[query];

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

    // Accessories (by RefClient)
    if (masterData.accessories) {
      const accessoryMatches = masterData.accessories
        .filter((acc) => acc.RefClient && acc.RefClient.toUpperCase().includes(query))
        .slice(0, 5)
        .map((acc) => ({
          id: acc.RefClient || "",
          type: "accessory" as const,
          fullId: constructAccessoryId(acc)
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
      (isExactBoxMatch || isExactConnectorMatch) && newSuggestions.length === 1;
    
    if (hasOnlyExactMatch) {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(newSuggestions.length > 0);
    }
  }, [searchQuery, masterData]);

  return { suggestions };
}
