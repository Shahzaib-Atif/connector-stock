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
  isRemoveDisabled?: boolean;
}

const defaultButtonClass =
  "max-w-80 flex-1 font-bold p-3 sm:p-4 rounded-xl flex items-center justify-center gap-2 transition-all";
const iconClass = "w-4 sm:w-5 h-4 sm:h-5";

export const TransactionBar: React.FC<TransactionBarProps> = ({
  onAdd,
  onRemove,
  addLabel = "ADD STOCK",
  removeLabel = "TAKE OUT",
  addIcon,
  removeIcon,
  className = "",
  isRemoveDisabled = false,
}) => {
  return (
    <div
      id="transaction-bar"
      className={`fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 p-3 sm:p-4 px-6 sm:pb-6 shadow-2xl z-20 backdrop-blur ${className}`}
    >
      <div className="justify-center max-w-3xl mx-auto flex gap-3 sm:gap-6 text-sm sm:text-lg">
        <button
          onClick={onRemove}
          disabled={isRemoveDisabled}
          className={`${defaultButtonClass} ${
            isRemoveDisabled
              ? "bg-slate-800/50 text-slate-600 border-slate-700 cursor-not-allowed"
              : "bg-slate-800 hover:bg-slate-700 text-white border-slate-600"
          }`}
        >
          {removeIcon ?? <Minus className={iconClass} />}
          {removeLabel}
        </button>
        <button
          onClick={onAdd}
          className={`${defaultButtonClass} btn-primary shadow-lg shadow-blue-900/50`}
        >
          {addIcon ?? <Plus className={iconClass} />}
          {addLabel}
        </button>
      </div>
    </div>
  );
};
