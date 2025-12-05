import React from "react";
import { ArrowRight, QrCode, Receipt, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

interface DetailHeaderProps {
  label?: string;
  title?: React.ReactNode;
  onBack?: () => void;
  handleQRClick?: () => void;
  showQR?: boolean;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  label,
  title,
  onBack,
  handleQRClick,
  showQR = true,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const showCenterSection = label || title;

  return (
    <header
      id="detail-header"
      className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800 px-4 py-3 shadow-sm"
    >
      <div className="mx-auto w-full flex items-center gap-4 min-h-[44px]">
        {/* LOGO and Back button */}
        <div className="flex flex-none items-center sm:gap-2 flex-shrink-0 sm:min-w-[100px]">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowRight className="w-6 h-6 rotate-180" />
            </button>
          )}
          <BrandLogo />
        </div>

        {/* Label and Title - only show if provided */}
        {showCenterSection && (
          <div className="text-center flex-1">
            {label && (
              <div className="text-xs sm:text-sm text-slate-500 font-medium uppercase tracking-wider">
                {label}
              </div>
            )}
            {title && (
              <div className="font-mono font-bold text-lg sm:text-xl text-white">
                {title}
              </div>
            )}
          </div>
        )}

        {/* Spacer when no center section */}
        {!showCenterSection && <div className="flex-1" />}

        {/* Right side actions */}
        <div className="flex flex-none items-center justify-end gap-1 flex-shrink-0 sm:min-w-[100px]">
          {/* QR Option - only shows when showQR and handleQRClick are provided */}
          {showQR && handleQRClick && (
            <button
              id="qr-code-btn"
              title="Show QR code"
              onClick={handleQRClick}
              className="p-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg"
              aria-label="Show accessory QR"
            >
              <QrCode className="w-6 h-6" />
            </button>
          )}

          {/* Transactions button */}
          <button
            id="view-transactions-btn"
            onClick={() => navigate("/transactions")}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg"
            title="View Transactions"
          >
            <Receipt className="w-5 h-5" />
          </button>

          {/* Logout button */}
          <button
            id="logout-btn"
            onClick={() => dispatch(logout())}
            className="p-2 text-slate-400 hover:text-white flex items-center gap-2 transition-colors rounded-lg"
            title="Logout"
          >
            <span className="text-sm font-mono hidden sm:inline">{user}</span>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
