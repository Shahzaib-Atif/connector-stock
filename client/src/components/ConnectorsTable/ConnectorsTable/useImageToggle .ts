import { useEffect, useState } from "react";

export const useImageToggle = () => {
  const [showImages, setShowImages] = useState<boolean>(() => {
    const saved = localStorage.getItem("connectors_show_images");
    if (saved === null || saved === undefined) {
      return true; // Default to true
    }
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("connectors_show_images", String(showImages));
  }, [showImages]);

  return { showImages, setShowImages };
};
