import React, { useState } from "react";
import { QrCode, Menu, LogIn, HomeIcon, Home } from "lucide-react";
import BrandLogo from "./BrandLogo";
import Sidebar from "./Sidebar";
import { useAppSelector } from "../../store/hooks";
import { Link } from "react-router-dom";

import { Breadcrumbs } from "./Breadcrumbs";
import { ROUTES } from "../AppRoutes";

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
        className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-800 p-2.5 sm:p-3.5 shadow-sm"
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
          </div>

          {/* Breadcrumbs - Absolutely centered */}
          <div className="text-center w-full flex items-center justify-center">
            <Breadcrumbs />
          </div>

          {/* Right side - QR button and Login button */}
          <div className="flex items-center gap-2">
            {!user && (
              <Link
                to={ROUTES.LOGIN}
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
