import React from "react";
import clsx from "clsx";

interface InventoryListItemProps {
  left: React.ReactNode;
  right: React.ReactNode;
  onClick?: () => void;
  interactive?: boolean;
  className?: string;
}

export const InventoryListItem: React.FC<InventoryListItemProps> = ({
  left,
  right,
  onClick,
  interactive = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-slate-800 p-4 rounded-xl border border-slate-700/50 shadow-sm",
        "flex items-center justify-between",
        interactive &&
          onClick && [
            "cursor-pointer transition-all",
            "hover:border-blue-500/50 hover:bg-slate-700/50",
            "active:scale-[0.99]",
          ]
      )}
    >
      <div className="flex items-center gap-4 flex-1">{left}</div>
      <div className="text-right">{right}</div>
    </div>
  );
};
