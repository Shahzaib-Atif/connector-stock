import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { refreshUsersList } from "@/store/slices/authSlice";
import { refreshMasterData } from "@/store/slices/masterDataSlice";
import { fetchUnfinishedNotifications } from "@/store/slices/notificationsSlice";
import { fetchOrcSamplesThunk } from "@/store/slices/samplesSlice";
import { refreshTransactionsData } from "@/store/slices/transactionsSlice";
import { UserRoles } from "@shared/enums/UserRoles";
import { useEffect } from "react";

export function useBackgroundRefresh(refreshInterval: number) {
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((state) => state.auth);

  // Set up a background refresh mechanism that periodically updates critical data
  useEffect(() => {
    const refreshData = () => {
      if (document.hidden) return;

      dispatch(refreshMasterData());
      dispatch(refreshTransactionsData());
      dispatch(fetchOrcSamplesThunk());

      const isAdmin = role === UserRoles.Admin || role === UserRoles.Master;
      if (user && isAdmin) {
        dispatch(fetchUnfinishedNotifications());
      }

      if (user && role === UserRoles.Master) {
        dispatch(refreshUsersList());
      }
    };

    const interval = window.setInterval(refreshData, refreshInterval);

    return () => window.clearInterval(interval);
  }, [dispatch, role, user]);
}
