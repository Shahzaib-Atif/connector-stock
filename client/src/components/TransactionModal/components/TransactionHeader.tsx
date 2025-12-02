import React from "react";
import { X } from "lucide-react";

interface TransactionHeaderProps {
  type: "IN" | "OUT";
  onClose: () => void;
}

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  type,
  onClose,
}) => {
  return (
    <div className="flex justify-between items-center ">
      <h3 className="text-lg sm:text-xl font-bold text-white">
        {type === "IN" ? "Add Stock" : "Remove Stock"}
      </h3>
      <button
        onClick={onClose}
        className="p-1 bg-slate-700 rounded-full text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
      >
        <X className="sm:w-5 w-4 sm:h-5 h-4" />
      </button>
    </div>
  );
};
