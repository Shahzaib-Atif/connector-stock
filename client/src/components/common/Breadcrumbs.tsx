import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "../AppRoutes";
import { useAppSelector } from "@/store/hooks";
import { AccessoryMap } from "@/utils/types";

export const Breadcrumbs: React.FC = () => {
  // Render breadcrumbs based on current route and loaded master data.
  const { data: masterData } = useAppSelector((state) => state.masterData);
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = buildBreadcrumbs(segments, masterData?.accessories);

  return (
    <nav
      id="Breadcrumbs"
      className="flex items-center justify-center text-[0.8rem] sm:text-base text-slate-200 font-medium uppercase
      overflow-x-auto whitespace-nowrap p-1 no-scrollbar max-w-[70%] sm:max-w-[60%]"
    >
      <BreadcrumbList items={breadcrumbs} />
    </nav>
  );
};

const breadcrumbChevron = "w-3 h-3 sm:w-4 sm:h-4 mx-1 text-slate-400";

type BreadcrumbItemData = {
  key: string;
  label: string;
  to?: string;
  isCurrent?: boolean;
};

const SEGMENT_LABELS: Record<string, string> = {
  connectors: "CONNECTORS",
  accessories: "ACCESSORIES",
  boxes: "BOXES",
  transactions: "TRANSACTIONS",
  samples: "SAMPLES",
  notifications: "NOTIFICATIONS",
  users: "USERS",
  login: "LOGIN",
};

function BreadcrumbList({ items }: { items: BreadcrumbItemData[] }) {
  // Render breadcrumb sequence with chevrons between items.
  return (
    <>
      {items.map((item, index) => (
        <React.Fragment key={item.key}>
          {index > 0 && <ChevronRight className={breadcrumbChevron} />}
          <BreadcrumbItem item={item} />
        </React.Fragment>
      ))}
    </>
  );
}

function BreadcrumbItem({ item }: { item: BreadcrumbItemData }) {
  // Render one breadcrumb as link or current text.
  if (!item.to || item.isCurrent) {
    return (
      <span
        className={`uppercase ${item.isCurrent ? "text-slate-300" : "text-slate-400"} truncate max-w-[120px] sm:max-w-none`}
      >
        {item.label}
      </span>
    );
  }

  return (
    <Link
      to={item.to}
      title={item.label}
      className="hover:text-blue-400 transition-colors flex-shrink-0 uppercase"
    >
      {item.label}
    </Link>
  );
}

function buildBreadcrumbs(
  segments: string[],
  accessories?: AccessoryMap,
): BreadcrumbItemData[] {
  // Build breadcrumb data from URL segments and accessory mapping.
  const items: BreadcrumbItemData[] = [
    { key: "home", label: "HOME", to: ROUTES.HOME },
  ];

  if (segments.length === 0) return items;

  // Keep existing UX: /boxes/:id starts with CONNECTORS instead of BOXES.
  if (segments[0] === "boxes") {
    items.push({
      key: "connectors-root",
      label: "CONNECTORS",
      to: ROUTES.CONNECTORS,
    });
    if (segments[1]) {
      items.push({
        key: "box-id",
        label: decodeURIComponent(segments[1]),
        isCurrent: true,
      });
    }
    return items;
  }

  segments.forEach((segment, index) => {
    const decoded = decodeURIComponent(segment);
    const to = `/${segments.slice(0, index + 1).join("/")}`;
    const isCurrent = index === segments.length - 1;

    // For connector detail pages, show box prefix crumb before full connector ID.
    if (segments[0] === "connectors" && index === 1 && decoded.length > 4) {
      const boxId = decoded.slice(0, 4);
      items.push({
        key: `box-prefix-${boxId}`,
        label: boxId,
        to: `${ROUTES.BOXES}/${boxId}`,
      });
    }

    const label = resolveSegmentLabel(decoded, segments, index, accessories);
    items.push({
      key: to,
      label,
      to: isCurrent ? undefined : to,
      isCurrent,
    });
  });

  return items;
}

function resolveSegmentLabel(
  segment: string,
  segments: string[],
  index: number,
  accessories?: AccessoryMap,
) {
  // Resolve visible label for each breadcrumb segment.
  if (segments[0] === "accessories" && index === 1) {
    return resolveAccessoryLabel(segment, accessories);
  }

  return SEGMENT_LABELS[segment.toLowerCase()] ?? segment;
}

function resolveAccessoryLabel(segment: string, accessories?: AccessoryMap) {
  // Resolve accessory segment to stable custom ID label.
  if (!accessories) return segment;

  const numericId = Number(segment);
  if (Number.isInteger(numericId)) {
    return accessories[numericId]?.customId ?? segment;
  }

  const normalized = segment.toLowerCase();
  const match = Object.values(accessories).find(
    (accessory) => accessory.customId?.toLowerCase() === normalized,
  );
  return match?.customId ?? segment;
}
