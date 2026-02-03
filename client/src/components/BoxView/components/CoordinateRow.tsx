import React from "react";

interface Props {
  cv: string;
  ch: string;
  label: string;
}

function CoordinateRow({ cv, ch, label }: Props) {
  return (
    <div className="flex items-center gap-1.5 font-mono font-bold text-white text-sm sm:text-base">
      <span className="text-[10px] text-blue-400 font-black uppercase">
        {label}:
      </span>
      {cv || "?"} <span className="text-slate-600">/</span> {ch || "?"}
    </div>
  );
}

export default CoordinateRow;
