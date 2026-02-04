import { ROUTES } from "@/components/AppRoutes";
import { useAppSelector } from "@/store/hooks";
import { Bell } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function NotificationBell() {
  const unfinishedCount = useAppSelector(
    (state) => state.notifications.unfinishedCount,
  );

  return (
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
  );
}

export default NotificationBell;
