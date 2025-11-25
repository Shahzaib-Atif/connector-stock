import { BoxIcon, CircuitBoard } from "lucide-react";
import React from "react";

interface Props {
  onScan: (code: string) => void;
}

function ExampleLookup({ onScan }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 pt-8">
      <button
        onClick={() => onScan("A288")}
        className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition text-left group"
      >
        <div className="text-indigo-400 mb-2 group-hover:scale-110 transition-transform origin-left">
          <BoxIcon />
        </div>
        <div className="font-semibold text-slate-200">Box A288 (example)</div>
        <div className="text-xs text-slate-500">PosId Lookup</div>
      </button>
      <button
        onClick={() => onScan("A288PI")}
        className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition text-left group"
      >
        <div className="text-emerald-400 mb-2 group-hover:scale-110 transition-transform origin-left">
          <CircuitBoard />
        </div>
        <div className="font-semibold text-slate-200">
          Part A288PI (example)
        </div>
        <div className="text-xs text-slate-500">Direct Part Lookup</div>
      </button>
    </div>
  );
}

export default ExampleLookup;
