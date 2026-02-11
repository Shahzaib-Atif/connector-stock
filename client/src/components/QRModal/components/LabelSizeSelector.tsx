import React from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface LabelSizeSelectorProps {
  useSmallLabels: boolean;
  setUseSmallLabels: (val: boolean) => void;
}

const LabelSizeSelector: React.FC<LabelSizeSelectorProps> = ({
  useSmallLabels,
  setUseSmallLabels,
}) => {
  return (
    <div className="flex items-center gap-3 p-1 rounded-lg bg-slate-700/50 border border-slate-600 transition-all">
      {/* Normal Label Button */}
      <button
        onClick={() => setUseSmallLabels(false)}
        className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
          !useSmallLabels
            ? "bg-blue-600 text-white shadow-lg"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <Maximize2 className="w-3.5 h-3.5" />
        <div className="flex flex-col leading-tight text-center">
          <span>Normal</span>
          <span className="text-[10px] opacity-80 text-slate-300">
            (Standard)
          </span>
        </div>
      </button>

      {/* Small Label Button */}
      <button
        onClick={() => setUseSmallLabels(true)}
        className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
          useSmallLabels
            ? "bg-blue-600 text-white shadow-lg"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <Minimize2 className="w-3.5 h-3.5" />
        <div className="flex flex-col leading-tight text-center">
          <span>Small</span>
          <span className="text-[10px] opacity-80 text-slate-300">
            (Samples)
          </span>
        </div>
      </button>
    </div>
  );
};

export default LabelSizeSelector;
