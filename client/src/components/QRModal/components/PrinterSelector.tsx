import React from "react";
import SelectPrinterBtn from "./SelectPrinterBtn";
import { Printer_t } from "@/types/printers";

interface Props {
  selectedPrinter: Printer_t;
  setSelectedPrinter: (printer: Printer_t) => void;
}

function PrinterSelector({ selectedPrinter, setSelectedPrinter }: Props) {
  return (
    <div
      className={`flex items-center gap-3 p-1 rounded-lg bg-slate-700/50 border border-slate-600 transition-all`}
    >
      {/* printer 1 */}
      <SelectPrinterBtn
        myPrinter={Printer_t.PRINTER_1}
        selectedPrinter={selectedPrinter}
        setSelectedPrinter={setSelectedPrinter}
      />

      {/* printer 2 */}
      <SelectPrinterBtn
        myPrinter={Printer_t.PRINTER_2}
        selectedPrinter={selectedPrinter}
        setSelectedPrinter={setSelectedPrinter}
      />
    </div>
  );
}

export default PrinterSelector;
