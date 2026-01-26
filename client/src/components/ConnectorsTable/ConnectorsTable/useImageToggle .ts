import { useEffect, useState } from "react";

export const useImageToggle = () => {
  const [showImages, setShowImages] = useState<boolean>(() => {
    const saved = localStorage.getItem("connectors_show_images");
    return saved === "true"; // Default to false
  });

  useEffect(() => {
    localStorage.setItem("connectors_show_images", String(showImages));
  }, [showImages]);

  return { showImages, setShowImages };
};
