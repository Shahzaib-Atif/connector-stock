import React, { useState } from "react";
import { QrCode, Menu, LogIn, Bell } from "lucide-react";
import BrandLogo from "./BrandLogo";
import Sidebar from "./Sidebar";
import { useAppSelector } from "../../store/hooks";
import { Link } from "react-router-dom";

import { Breadcrumbs } from "./Breadcrumbs";
import { ROUTES } from "../AppRoutes";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { UserRoles } from "@/utils/types/userTypes";

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
  const role = useAppSelector((state) => state.auth.role);
  const unfinishedCount = useAppSelector(
    (state) => state.notifications.unfinishedCount
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = role === UserRoles.Admin || role === UserRoles.Master;
  const showCenterSection = label || title;
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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

            {/* Notification Bell */}
            {user && isAdmin && (
              <Link
                to={ROUTES.NOTIFICATIONS}
                className="p-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg flex-shrink-0 relative"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-6 h-6" />
                {unfinishedCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-slate-900 animate-pulse">
                    {unfinishedCount}
                  </span>
                )}
              </Link>
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

      {/* Password change modal */}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}

      {/* Sidebar */}
      <Sidebar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setShowPasswordModal={setShowPasswordModal}
      />
    </>
  );
};

const IconClass1 =
  "p-0.5 sm:p-2 text-slate-300 hover:text-white transition-colors rounded-lg flex-shrink-0";
