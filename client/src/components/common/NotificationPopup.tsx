import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUnfinishedNotifications } from "@/store/slices/notificationsSlice";
import { ROUTES } from "../AppRoutes";

export const NotificationPopup: React.FC = () => {
  const dispatch = useAppDispatch();
  const { unreadCount } = useAppSelector((state) => state.notifications);
  const [isVisible, setIsVisible] = useState(false);
  const checkInterval = 2; // minutes

  // Poll for new notifications periodically
  useEffect(() => {
    const interval = setInterval(
      () => {
        dispatch(fetchUnfinishedNotifications());
      },
      checkInterval * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [dispatch]);

  // Show popup whenever unread count increases
  useEffect(() => {
    if (unreadCount > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [unreadCount]);

  if (!isVisible || unreadCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-blue-600/90 backdrop-blur-md border border-blue-400/30 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm">
        <div className="bg-white/20 p-2 rounded-xl">
          <Bell className="w-6 h-6 animate-bounce" />
        </div>

        <div className="flex-1">
          <p className="font-bold text-sm">You have new requests!</p>
          <p className="text-xs text-blue-100 mb-2">
            There are {unreadCount} unread sample requests.
          </p>
          <Link
            to={ROUTES.NOTIFICATIONS}
            onClick={() => setIsVisible(false)}
            className="text-xs font-bold uppercase tracking-wider bg-white text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors inline-block"
          >
            View All
          </Link>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/10 rounded-full transition-colors self-start"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
