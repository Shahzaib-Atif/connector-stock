import { useEffect, useState } from "react";

export const useImageToggle = () => {
  const storageKey = "connectors_show_images";

  const [showImages, setShowImages] = useState<boolean>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved === null || saved === undefined) {
      return true; // Default to true
    }
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem(storageKey, String(showImages));
  }, [showImages]);

  return { showImages, setShowImages };
};
