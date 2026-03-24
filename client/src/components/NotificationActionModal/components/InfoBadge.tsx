import React from "react";

interface Props {
  title: string;
  text: string;
}

function InfoBadge({ title, text }: Props) {
  return (
    <div className="flex-row bg-slate-700 px-3 py-2 rounded">
      {title && <span className="text-slate-400 text-sm">{title}:</span>}
      <span className="text-white font-mono font-semibold">{text}</span>
    </div>
  );
}

export default InfoBadge;
