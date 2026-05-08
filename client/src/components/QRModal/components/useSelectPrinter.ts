import { Printer_t, STORAGE_KEYS } from "@/utils/constants";
import { useState } from "react";

export default function usePrinterSelection(storageKey: STORAGE_KEYS) {
  const [selectedPrinter, setSelectedPrinter] = useState<Printer_t>(() => {
    const stored = localStorage.getItem(storageKey);
    return Object.values(Printer_t).includes(stored as Printer_t)
      ? (stored as Printer_t)
      : Printer_t.PRINTER_1;
  });

  const updatePrinter = (printer: Printer_t) => {
    setSelectedPrinter(printer);
    localStorage.setItem(storageKey, printer);
  };

  return { selectedPrinter, updatePrinter };
}
