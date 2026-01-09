import { AlertTriangle } from "lucide-react";
import React from "react";

interface Props {
  printQty: number;
}

function PrintWarning({ printQty }: Props) {
  return (
    <div className="mb-6 flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-xs text-left animate-in zoom-in-95">
      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
      <span>
        Warning: You are about to print <strong>{printQty}</strong> labels.
        Please confirm before proceeding.
      </span>
    </div>
  );
}

export default PrintWarning;
