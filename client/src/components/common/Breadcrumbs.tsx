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
      className="flex items-center justify-center text-[0.8rem] sm:text-base text-slate-200 font-medium uppercase   
      overflow-x-auto whitespace-nowrap p-1 no-scrollbar max-w-full flex-wrap max-w-[70%] sm:max-w-[60%]"
    >
      {/* Home */}
      <Link
        to={ROUTES.HOME}
        className="hover:text-blue-400 transition-colors flex-shrink-0"
        title="home"
      >
        Home
      </Link>

      {/* Other breadcrumbs */}
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const label = ROUTES[value.toLowerCase()] || value;
        const isBox = pathnames.includes("boxes");

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-0.5 sm:mx-1 text-slate-400 flex-shrink-0" />
            {last ? (
              <span className="text-slate-300 truncate max-w-[120px] sm:max-w-none uppercase">
                {label}
              </span>
            ) : isBox ? (
              <span className="text-slate-400">{label}</span>
            ) : (
              <Link
                to={to}
                className="hover:text-blue-400 transition-colors flex-shrink-0"
                title={label}
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
