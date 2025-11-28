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
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold text-white">
        {type === "IN" ? "Add Stock" : "Remove Stock"}
      </h3>
      <button
        onClick={onClose}
        className="p-1 bg-slate-700 rounded-full text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
