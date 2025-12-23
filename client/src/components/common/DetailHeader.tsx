import React, { useState } from "react";
import { QrCode, Menu, LogIn, HomeIcon, Home } from "lucide-react";
import BrandLogo from "./BrandLogo";
import Sidebar from "./Sidebar";
import { useAppSelector } from "../../store/hooks";
import { Link } from "react-router-dom";

interface DetailHeaderProps {
  label?: string;
  title?: React.ReactNode;
  onBack?: () => void;
  handleQRClick?: () => void;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  label,
  title,
  handleQRClick,
}) => {
  const user = useAppSelector((state) => state.auth.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const showCenterSection = label || title;

  return (
    <>
      <header
        id="detail-header"
        className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800 p-2.5 sm:p-3.5 shadow-sm"
      >
        <div className="mx-auto w-full flex items-center justify-between min-h-[44px] relative">
          {/* Left side - Menu button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={IconClass1}
              aria-label="Toggle menu"
              title="menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* LOGO section - hidden on mobile */}
            <div className="hidden sm:flex items-center">
              <BrandLogo />
            </div>

            {/* Home Icon - visible on mobile only */}
            <Link
              to="/"
              className={`${IconClass1} flex sm:hidden`}
              title="home"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>

          {/* Label and Title - absolutely centered */}
          {showCenterSection && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              {label && (
                <div className="text-xs sm:text-sm text-slate-500 font-medium uppercase tracking-wider">
                  {label}
                </div>
              )}
              {title && (
                <div className="font-mono font-bold text-base sm:text-xl text-white truncate max-w-[180px] sm:max-w-none">
                  {title}
                </div>
              )}
            </div>
          )}

          {/* Right side - QR button and Login button */}
          <div className="flex items-center gap-2">
            {!user && (
              <Link
                to="/login"
                className="flex items-center gap-1 sm:gap-2 px-1 sm:px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                title="login"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
            {handleQRClick && user && (
              <button
                id="qr-code-btn"
                title="Show QR code"
                onClick={handleQRClick}
                className="p-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg flex-shrink-0"
                aria-label="Show QR code"
              >
                <QrCode className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Overlay - outside header */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </>
  );
};

const IconClass1 =
  "p-0.5 sm:p-2 text-slate-300 hover:text-white transition-colors rounded-lg flex-shrink-0";
