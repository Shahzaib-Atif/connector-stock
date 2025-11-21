import React from "react";

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
  className = "",
}) => {
  const interactiveClasses = interactive
    ? "cursor-pointer hover:border-blue-500/50 hover:bg-slate-700/50 transition-all active:scale-[0.99]"
    : "";

  const baseClasses =
    "bg-slate-800 p-4 rounded-xl border border-slate-700/50 shadow-sm flex items-center justify-between";

  const combinedClasses = [
    baseClasses,
    onClick ? interactiveClasses : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <div
      onClick={onClick}
      className={combinedClasses}
    >
      <div className="flex items-center gap-4 flex-1">{left}</div>
      <div className="text-right">{right}</div>
    </div>
  );
};

