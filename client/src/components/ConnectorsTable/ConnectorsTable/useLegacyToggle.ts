import { useEffect, useState } from "react";

export const useLegacyToggle = (storageKey: string) => {
  const [isLegacyMode, setIsLegacyMode] = useState<boolean>(() => {
    const show = localStorage.getItem(storageKey);
    return show === "true"; // default to false if not set
  });

  useEffect(() => {
    localStorage.setItem(storageKey, String(isLegacyMode));
  }, [isLegacyMode]);

  return { isLegacyMode, setIsLegacyMode };
};
