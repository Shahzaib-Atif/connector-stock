import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { ROUTES } from "../AppRoutes";

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (location.pathname === "/") return null;

  return (
    <nav
      id="Breadcrumbs"
      className="flex items-center justify-end text-xs sm:text-sm sm:text-xs text-slate-200 font-medium uppercase tracking-wider 
      overflow-x-auto whitespace-nowrap py-1.5 px-4 sm:px-6 no-scrollbar"
    >
      {/* Home */}
      <Link
        to={ROUTES.HOME}
        className="hover:text-blue-400 transition-colors flex items-center gap-1 flex-shrink-0"
      >
        <Home className="w-3 h-3" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {/* Other breadcrumbs */}
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const label = ROUTES[value.toLowerCase()] || value;
        const isBox = pathnames.includes(label);

        const isId =
          index === 1 &&
          (pathnames[0] === ROUTES.CONNECTORS ||
            pathnames[0] === ROUTES.BOXES ||
            pathnames[0] === ROUTES.ACCESSORIES);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3 h-3 mx-1 text-slate-600 flex-shrink-0" />
            {last ? (
              <span className="text-slate-300 truncate max-w-[120px] sm:max-w-none">
                {isId ? value.toUpperCase() : label}
              </span>
            ) : isBox ? (
              <span className="text-slate-600">{label}</span>
            ) : (
              <Link
                to={to}
                className="hover:text-blue-400 transition-colors flex-shrink-0"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
