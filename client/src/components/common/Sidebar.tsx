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
} from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({ isMenuOpen, setIsMenuOpen }: Props) {
  const user = useAppSelector((state) => state.auth.user);
  const role = useAppSelector((state) => state.auth.role);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Close menu when clicking outside
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  // close menu
  const closeMenu = () => setIsMenuOpen(false);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    navigate("/login");
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
          </>
        ) : (
          <p className="text-white font-semibold">Not logged in</p>
        )}
      </div>

      {/* Menu items */}
      <nav className="py-2">
        <Link to="/" id="home-btn" onClick={closeMenu} className="sidebar-btn">
          <Home className="sidebar-btn-icon" />
          <span>Home</span>
        </Link>

        {/* View Transactions */}
        <Link
          to="/transactions"
          id="view-transactions-btn"
          onClick={closeMenu}
          className="sidebar-btn"
        >
          <Receipt className="sidebar-btn-icon" />
          <span>View Transactions</span>
        </Link>

        {/* View Samples */}
        <Link
          to="/samples"
          id="view-samples-btn"
          onClick={closeMenu}
          className="sidebar-btn"
        >
          <Beaker className="sidebar-btn-icon" />
          <span>View Samples</span>
        </Link>

        {/* View Connectors */}
        <Link
          to="/connectors"
          id="view-connectors-btn"
          onClick={closeMenu}
          className="sidebar-btn"
        >
          <Cable className="sidebar-btn-icon" />
          <span>View Connectors</span>
        </Link>

        {/* View Accessories */}
        <Link
          to="/accessories"
          id="view-accessories-btn"
          onClick={closeMenu}
          className="sidebar-btn"
        >
          <Wrench className="sidebar-btn-icon" />
          <span>View Accessories</span>
        </Link>

        {/* User Management (Master Admin only) */}
        {role === "Master Admin" && (
          <Link
            to="/users"
            id="user-mgmt-btn"
            onClick={closeMenu}
            className="sidebar-btn text-blue-400 hover:text-blue-300"
          >
            <Users className="sidebar-btn-icon" />
            <span>Manage Users</span>
          </Link>
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
            to="/login"
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
