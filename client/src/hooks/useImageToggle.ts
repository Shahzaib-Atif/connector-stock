import { STORAGE_KEYS } from "@/utils/constants";
import { useEffect, useState } from "react";

export const useImageToggle = (storageKey: STORAGE_KEYS) => {
  const [showImages, setShowImages] = useState<boolean>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved === null || saved === undefined) {
      return true; // Default to true
    }
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem(storageKey, String(showImages));
  }, [showImages, storageKey]);

  return { showImages, setShowImages };
};
