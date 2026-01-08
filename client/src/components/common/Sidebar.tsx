import React from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import {
  Beaker,
  Cable,
  Home,
  Lock,
  LogOut,
  Receipt,
  Users,
  Wrench,
  X,
  Key,
  Bell,
} from "lucide-react";
import { useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../AppRoutes";
import { fetchUnfinishedNotifications } from "@/store/slices/notificationsSlice";
import { useEffect } from "react";
import { UserRoles } from "@/utils/types/userTypes";

interface Props {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({
  isMenuOpen,
  setIsMenuOpen,
  setShowPasswordModal,
}: Props) {
  const user = useAppSelector((state) => state.auth.user);
  const role = useAppSelector((state) => state.auth.role);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const unfinishedCount = useAppSelector(
    (state) => state.notifications.unfinishedCount
  );

  useEffect(() => {
    if (user && (role === UserRoles.Master || role === UserRoles.Admin)) {
      dispatch(fetchUnfinishedNotifications());
    }
  }, [dispatch, user, role]);

  const getButtonClass = (path: string) => {
    const isActive = location.pathname === path;
    return `sidebar-btn ${isActive ? "text-blue-400 hover:text-blue-300" : ""}`;
  };

  // Close menu when clicking outside
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  // close menu
  const closeMenu = () => setIsMenuOpen(false);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 h-full w-64 bg-slate-800 border-r border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
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
          <X className="sidebar-btn-icon" />
        </button>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-slate-700">
        {user ? (
          <>
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Logged in as
            </p>
            <p className="text-white font-mono font-semibold mt-1">{user}</p>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <Key className="w-3 h-3" />
              Change Password
            </button>
          </>
        ) : (
          <p className="text-white font-semibold">Not logged in</p>
        )}
      </div>

      {/* Menu items */}
      <nav className="py-2">
        <Link
          to={ROUTES.HOME}
          id="home-btn"
          onClick={closeMenu}
          className={getButtonClass("/")}
        >
          <Home className="sidebar-btn-icon" />
          <span>Home</span>
        </Link>

        {/* View Transactions */}
        <Link
          to={ROUTES.TRANSACTIONS}
          id="view-transactions-btn"
          onClick={closeMenu}
          className={getButtonClass("/transactions")}
        >
          <Receipt className="sidebar-btn-icon" />
          <span>View Transactions</span>
        </Link>

        {/* View Samples */}
        <Link
          to={ROUTES.SAMPLES}
          id="view-samples-btn"
          onClick={closeMenu}
          className={getButtonClass("/samples")}
        >
          <Beaker className="sidebar-btn-icon" />
          <span>View Samples</span>
        </Link>

        {/* View Connectors */}
        <Link
          to={ROUTES.CONNECTORS}
          id="view-connectors-btn"
          onClick={closeMenu}
          className={getButtonClass("/connectors")}
        >
          <Cable className="sidebar-btn-icon" />
          <span>View Connectors</span>
        </Link>

        {/* View Accessories */}
        <Link
          to={ROUTES.ACCESSORIES}
          id="view-accessories-btn"
          onClick={closeMenu}
          className={getButtonClass("/accessories")}
        >
          <Wrench className="sidebar-btn-icon" />
          <span>View Accessories</span>
        </Link>

        {/* User Management (Master or Admin) */}
        {(role === UserRoles.Master || role === UserRoles.Admin) && (
          <>
            <Link
              to={ROUTES.NOTIFICATIONS}
              id="notifications-btn"
              onClick={closeMenu}
              className={getButtonClass(ROUTES.NOTIFICATIONS)}
            >
              <div className="relative">
                <Bell className="sidebar-btn-icon" />
                {unfinishedCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                    {unfinishedCount}
                  </span>
                )}
              </div>
              <span>Notifications</span>
            </Link>

            <Link
              to={ROUTES.USERS}
              id="user-mgmt-btn"
              onClick={closeMenu}
              className={getButtonClass(ROUTES.USERS)}
            >
              <Users className="sidebar-btn-icon" />
              <span>Manage Users</span>
            </Link>
          </>
        )}
      </nav>

      {/* Login/Logout at bottom */}
      {user ? (
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700 p-2">
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="sidebar-btn hover:text-red-300"
          >
            <LogOut className="sidebar-btn-icon" />
            <span>Logout</span>
          </button>
        </div>
      ) : (
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700 p-2">
          <Link
            to={ROUTES.LOGIN}
            id="login-nav-btn"
            onClick={closeMenu}
            className="sidebar-btn"
          >
            <Lock className="sidebar-btn-icon" />
            <span>Login</span>
          </Link>{" "}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
