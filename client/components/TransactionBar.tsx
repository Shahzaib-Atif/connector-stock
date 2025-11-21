import React, { ReactNode } from "react";
import { Minus, Plus } from "lucide-react";

interface TransactionBarProps {
  onAdd: () => void;
  onRemove: () => void;
  addLabel?: string;
  removeLabel?: string;
  addIcon?: ReactNode;
  removeIcon?: ReactNode;
  className?: string;
}

const defaultButtonClass =
  "flex-1 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all";

export const TransactionBar: React.FC<TransactionBarProps> = ({
  onAdd,
  onRemove,
  addLabel = "ADD STOCK",
  removeLabel = "TAKE OUT",
  addIcon,
  removeIcon,
  className = "",
}) => {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 p-4 px-6 pb-6 shadow-2xl z-20 backdrop-blur ${className}`}
    >
      <div className="max-w-3xl mx-auto flex gap-4">
        <button
          onClick={onRemove}
          className={`${defaultButtonClass} bg-slate-800 hover:bg-slate-700 text-white border border-slate-600`}
        >
          {removeIcon ?? <Minus className="w-5 h-5" />}
          {removeLabel}
        </button>
        <button
          onClick={onAdd}
          className={`${defaultButtonClass} bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50`}
        >
          {addIcon ?? <Plus className="w-5 h-5" />}
          {addLabel}
        </button>
      </div>
    </div>
  );
};

