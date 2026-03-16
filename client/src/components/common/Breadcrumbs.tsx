import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "../AppRoutes";

export const Breadcrumbs: React.FC = () => {
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const isBox = segments.includes("boxes");

  const getLabel = (value: string) =>
    (ROUTES as Record<string, string>)[value.toLowerCase()] ?? value;

  const renderItem = (
    label: string,
    to: string,
    isLast: boolean,
    isDisabled?: boolean,
  ) => {
    if (isLast || isDisabled) {
      return (
        <span
          className={`uppercase ${isLast ? "text-slate-300" : "text-slate-400"} truncate max-w-[120px] sm:max-w-none`}
        >
          {label}
        </span>
      );
    }

    return (
      <Link
        to={to}
        title={label}
        className="hover:text-blue-400 transition-colors flex-shrink-0 uppercase"
      >
        {label}
      </Link>
    );
  };

  return (
    <nav
      id="Breadcrumbs"
      className="flex items-center justify-center text-[0.8rem] sm:text-base text-slate-200 font-medium uppercase
      overflow-x-auto whitespace-nowrap p-1 no-scrollbar max-w-[70%] sm:max-w-[60%]"
    >
      <Link
        to={ROUTES.HOME}
        className="hover:text-blue-400 transition-colors flex-shrink-0"
        title="Home"
      >
        Home
      </Link>

      {segments.map((segment, index) => {
        const last = index === segments.length - 1;
        const to = `/${segments.slice(0, index + 1).join("/")}`;
        const isConnectorItem =
          segments[0] === "connectors" && index === 1 && segment.length > 4;
        const isBoxesPath = segments[0] === "boxes";

        const items = [];

        // For paths like /boxes/A037, we override the first segment to be "CONNECTORS"
        if (isBoxesPath && index === 0) {
           return (
             <React.Fragment key={to}>
                 <ChevronRight className={breadcrumbChevron} />
                 {renderItem("CONNECTORS", ROUTES.CONNECTORS, false, false)}
             </React.Fragment>
           );
        }

        const label = getLabel(segment);

        // If this is a connector item, add an extra breadcrumb for the box it belongs to
        if (isConnectorItem) {
          const prefix = segment.substring(0, 4);
          const boxPath = `${ROUTES.BOXES}/${prefix}`;

          // Add the box breadcrumb before the connector
          items.push(
            <React.Fragment key={`${to}-prefix`}>
              <ChevronRight className={breadcrumbChevron} />
              <Link
                to={boxPath}
                title={`View Box ${prefix}`}
                className="hover:text-blue-400 transition-colors"
              >
                {prefix}
              </Link>
            </React.Fragment>,
          );
        }

        // Add the actual breadcrumb item
        items.push(
          <React.Fragment key={to}>
            <ChevronRight className={breadcrumbChevron} />
            {isBoxesPath && index === 1 ? (
              <span className="uppercase text-slate-300 truncate max-w-[120px] sm:max-w-none">
                {label}
              </span>
            ) : (
              renderItem(label, to, last, !last && isBox)
            )}
          </React.Fragment>,
        );

        return items;
      })}
    </nav>
  );
};

const breadcrumbChevron = "w-3 h-3 sm:w-4 sm:h-4 mx-1 text-slate-400";
