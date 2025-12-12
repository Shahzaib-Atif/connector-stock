import React, { useState, useRef, useEffect } from "react";
import { QrCode, Receipt, LogOut, Beaker, Menu, X, Home } from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const showCenterSection = label || title;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  const handleMenuAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <header
      id="detail-header"
      className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800 px-4 py-3 shadow-sm"
    >
      <div className="mx-auto w-full flex items-center gap-4 min-h-[44px]">
        {/* Left side - Menu button */}
        <div
          className="flex flex-none items-center flex-shrink-0 relative"
          ref={menuRef}
        >
          <button
            id="menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute left-0 top-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 min-w-[220px]">
              {/* User info */}
              <div className="px-4 py-3 border-b border-slate-700">
                <p className="text-sm text-slate-400">Logged in as</p>
                <p className="text-white font-mono font-semibold">{user}</p>
              </div>

              {/* Menu items */}
              <div className="py-2">
                {/* Home button */}
                <button
                  id="home-btn"
                  onClick={() => handleMenuAction(() => navigate("/"))}
                  className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-3"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </button>

                {/* Transactions button */}
                <button
                  id="view-transactions-btn"
                  onClick={() =>
                    handleMenuAction(() => navigate("/transactions"))
                  }
                  className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-3"
                >
                  <Receipt className="w-5 h-5" />
                  <span>View Transactions</span>
                </button>

                {/* Samples button */}
                <button
                  id="view-samples-btn"
                  onClick={() => handleMenuAction(() => navigate("/samples"))}
                  className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-3"
                >
                  <Beaker className="w-5 h-5" />
                  <span>View Samples</span>
                </button>

                {/* Logout button */}
                <button
                  id="logout-btn"
                  onClick={() => handleMenuAction(() => dispatch(logout()))}
                  className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 hover:text-red-400 transition-colors flex items-center gap-3 border-t border-slate-700 mt-2 pt-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LOGO section */}
        <div className="flex flex-none items-center flex-shrink-0">
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

        {/* Right side - QR button */}
        {showQR && handleQRClick && (
          <div className="flex flex-none items-center justify-end flex-shrink-0">
            <button
              id="qr-code-btn"
              title="Show QR code"
              onClick={handleQRClick}
              className="p-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg"
              aria-label="Show QR code"
            >
              <QrCode className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
