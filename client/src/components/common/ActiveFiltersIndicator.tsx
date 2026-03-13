import React from "react";

interface ActiveFiltersIndicatorProps {
  count: number;
}

export const ActiveFiltersIndicator: React.FC<ActiveFiltersIndicatorProps> = ({
  count,
}) => {
  if (count <= 0) return null;

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 animate-in fade-in zoom-in duration-300">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-sm">
        {count}
      </span>
      <span className="text-xs font-medium">
        {count === 1 ? "Filter active" : "Filters active"}
      </span>
    </div>
  );
};
