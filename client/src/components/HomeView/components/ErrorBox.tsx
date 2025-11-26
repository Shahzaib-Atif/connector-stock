import { AlertTriangle } from "lucide-react";
import React from "react";

function ErrorBox({ scanError }) {
  return (
    <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
      <p className="text-amber-200 text-sm leading-relaxed">{scanError}</p>
    </div>
  );
}

export default ErrorBox;
