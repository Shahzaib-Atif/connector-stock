import React from "react";
import { ArrowRight, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

interface DetailHeaderProps {
  label: string;
  title: React.ReactNode;
  onBack: () => void;
  handleQRClick: () => void;
  showQR?: boolean;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  label,
  title,
  onBack,
  handleQRClick,
  showQR = true,
}) => {
  return (
    <header
      id="detail-header"
      className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm"
    >
      <div className="mx-auto w-full flex items-center gap-4">
        {/* LOGO and Back button */}
        <div className="flex flex-none items-center sm:gap-2 flex-shrink-0 sm:min-w-[100px]">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowRight className="w-6 h-6 rotate-180" />
          </button>
          <BrandLogo />
        </div>

        {/* Label and Title */}
        <div className="text-center flex-1">
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            {label}
          </div>
          <div className="font-mono font-bold text-xl text-white">{title}</div>
        </div>

        {/* QR Option */}
        {showQR && (
          <div className="flex flex-none items-center justify-end flex-shrink-0 sm:min-w-[100px]">
            <button
              onClick={handleQRClick}
              className="p-2 -mr-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg"
              aria-label="Show accessory QR"
            >
              <QrCode className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
