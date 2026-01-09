import { Loader2, Printer } from "lucide-react";
import React from "react";

interface Props {
  isPrinting: boolean;
  onClose: () => void;
  handlePrint: () => void;
}

function ActionButtons({ isPrinting, onClose, handlePrint }: Props) {
  return (
    <div className="flex gap-3">
      <button
        onClick={handlePrint}
        disabled={isPrinting}
        className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-xl transition-colors border border-blue-500 flex items-center justify-center gap-2"
      >
        {isPrinting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Printing...
          </>
        ) : (
          <>
            <Printer className="w-5 h-5" />
            Print Label
          </>
        )}
      </button>
      <button
        onClick={onClose}
        className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors border border-slate-600"
      >
        Close
      </button>
    </div>
  );
}

export default ActionButtons;
