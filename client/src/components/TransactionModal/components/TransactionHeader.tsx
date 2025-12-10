import React from "react";
import { X } from "lucide-react";

interface TransactionHeaderProps {
  type: "IN" | "OUT";
  onClose: () => void;
  targetId: string;
}

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  type,
  onClose,
  targetId,
}) => {
  return (
    <div className="flex justify-between items-center ">
      <div className="flex flex-col flex-1 items-center gap-0.5">
        <h3 className="text-lg sm:text-xl font-bold text-white">
          {type === "IN" ? "Add Stock" : "Remove Stock"}
        </h3>
        <span className="text-sm font-normal">({targetId})</span>
      </div>
      <button
        onClick={onClose}
        className="p-1 bg-slate-700 rounded-full text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
      >
        <X className="sm:w-5 w-4 sm:h-5 h-4" />
      </button>
    </div>
  );
};
