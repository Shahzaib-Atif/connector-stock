import { STORAGE_KEYS } from "@/utils/constants";
import { useEffect, useState } from "react";

export const useFiltersToggle = (storageKey: STORAGE_KEYS) => {
  const [showFilters, setShowFilters] = useState<boolean>(() => {
    const show = localStorage.getItem(storageKey);
    return show === "true"; // default to false if not set
  });

  useEffect(() => {
    localStorage.setItem(storageKey, String(showFilters));
  }, [showFilters]);

  return { showFilters, setShowFilters };
};
