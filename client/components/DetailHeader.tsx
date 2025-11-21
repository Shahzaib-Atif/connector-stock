import React from "react";
import { ArrowRight } from "lucide-react";

interface DetailHeaderProps {
  label: string;
  title: React.ReactNode;
  onBack: () => void;
  rightSlot?: React.ReactNode;
  className?: string;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  label,
  title,
  onBack,
  rightSlot,
  className = "",
}) => {
  return (
    <header
      className={`bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm ${className}`}
    >
      <button
        onClick={onBack}
        className="p-2 -ml-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
        aria-label="Go back"
      >
        <ArrowRight className="w-6 h-6 rotate-180" />
      </button>
      <div className="text-center">
        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
          {label}
        </div>
        <div className="font-mono font-bold text-xl text-white">{title}</div>
      </div>
      {rightSlot ?? <div className="w-10" />}
    </header>
  );
};

