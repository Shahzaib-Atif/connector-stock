import { Printer_t } from "@/types/printers";
import { Printer } from "lucide-react";

interface Props {
  myPrinter: Printer_t;
  selectedPrinter: Printer_t;
  setSelectedPrinter: (printer: Printer_t) => void;
}

function SelectPrinterBtn({
  myPrinter,
  selectedPrinter,
  setSelectedPrinter,
}: Props) {
  return (
    <button
      onClick={() => setSelectedPrinter(myPrinter)}
      className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
        selectedPrinter === myPrinter
          ? "bg-blue-600 text-white shadow-lg"
          : "text-slate-400 hover:text-slate-200"
      }`}
    >
      <Printer className="w-3.5 h-3.5" />

      <div className="flex flex-col leading-tight text-center">
        <span>Printer {myPrinter.split("_")[1]}</span>
        <span className="text-xs opacity-90 text-slate-300">
          ({myPrinter === Printer_t.PRINTER_1 ? "samples" : "GT"})
        </span>
      </div>
    </button>
  );
}

export default SelectPrinterBtn;
