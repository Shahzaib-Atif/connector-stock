import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUnfinishedNotifications } from "@/store/slices/notificationsSlice";
import { UserRoles } from "@shared/enums/UserRoles";
import { useEffect } from "react";

export function useBackgroundRefresh(refreshInterval: number) {
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((state) => state.auth);

  // Keep notifications reasonably fresh without repeatedly refetching the rest
  // of the application state in the background.
  useEffect(() => {
    const refreshNotifications = () => {
      if (document.hidden) return;

      const isAdmin = role === UserRoles.Admin || role === UserRoles.Master;
      if (user && isAdmin) {
        dispatch(fetchUnfinishedNotifications());
      }
    };

    const interval = window.setInterval(refreshNotifications, refreshInterval);

    return () => window.clearInterval(interval);
  }, [dispatch, role, user]);
}
