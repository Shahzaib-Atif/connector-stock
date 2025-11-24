import React from "react";
import { Box as BoxIcon, ArrowRight } from "lucide-react";

interface BoxShortcutProps {
  posId: string;
  onOpen: () => void;
}

export const BoxShortcut: React.FC<BoxShortcutProps> = ({ posId, onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="w-full p-4 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between group hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-700 text-slate-300 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <BoxIcon className="w-5 h-5" />
        </div>
        <div className="text-left">
          <div className="font-bold text-slate-200">View Box {posId}</div>
          <div className="text-xs text-slate-500">
            See all items in this location
          </div>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400" />
    </button>
  );
};

