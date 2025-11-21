import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
  const brand = (
    <Link
      to="/"
      className="flex items-center gap-2 px-2 py-1 text-slate-400 hover:text-white transition-colors rounded-lg"
      aria-label="Go home"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 text-blue-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      <span className="text-base font-bold tracking-wide">divmac</span>
    </Link>
  );

  const rightContent = rightSlot ?? <div className="w-10" />;

  return (
    <header
      className={`bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm ${className}`}
    >
      <div className="max-w-4xl mx-auto w-full flex items-center gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowRight className="w-6 h-6 rotate-180" />
          </button>
          <div className="hidden sm:block">{brand}</div>
        </div>
        <div className="text-center flex-1">
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            {label}
          </div>
          <div className="font-mono font-bold text-xl text-white">{title}</div>
        </div>
        <div className="flex items-center justify-end flex-shrink-0 min-w-[40px]">
          {rightContent}
        </div>
      </div>
    </header>
  );
};

