import { STORAGE_KEYS } from "@/utils/constants";
import { useState } from "react";

export default function usePrinterLabelSizeSelection(storageKey: STORAGE_KEYS) {
  const [useSmallLabels, setUseSmallLabels] = useState<boolean>(() => {
    return localStorage.getItem(storageKey) === "true";
  });

  const updateLabelSize = (val: boolean) => {
    setUseSmallLabels(val);
    localStorage.setItem(storageKey, String(val));
  };

  return { useSmallLabels, updateLabelSize };
}
