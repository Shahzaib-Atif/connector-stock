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
    <>
      <header
        id="detail-header"
        className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800 px-4 py-3 shadow-sm"
      >
        <div className="mx-auto w-full flex items-center gap-4 min-h-[44px]">
          {/* Left side - Menu button */}
          <button
            id="menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg flex-shrink-0"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

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
      </header>

      {/* Sidebar Overlay - outside header */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Slide-in Sidebar - outside header */}
      <div 
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-64 bg-slate-800 border-r border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header with close button */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
          <span className="text-lg font-semibold text-white">Menu</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-slate-700">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Logged in as</p>
          <p className="text-white font-mono font-semibold mt-1">{user}</p>
        </div>

        {/* Menu items */}
        <nav className="py-2">
          <button
            id="home-btn"
            onClick={() => handleMenuAction(() => navigate("/"))}
            className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-3"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            id="view-transactions-btn"
            onClick={() => handleMenuAction(() => navigate("/transactions"))}
            className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-3"
          >
            <Receipt className="w-5 h-5" />
            <span>View Transactions</span>
          </button>

          <button
            id="view-samples-btn"
            onClick={() => handleMenuAction(() => navigate("/samples"))}
            className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-3"
          >
            <Beaker className="w-5 h-5" />
            <span>View Samples</span>
          </button>
        </nav>

        {/* Logout at bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700 p-2">
          <button
            id="logout-btn"
            onClick={() => handleMenuAction(() => dispatch(logout()))}
            className="w-full px-4 py-3 text-left text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center gap-3 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};
