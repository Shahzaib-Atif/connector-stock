import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RefreshCw } from "lucide-react";
import { UserRoles } from "@/utils/types/userTypes";
import { initMasterData } from "@/store/slices/masterDataSlice";
import { initTransactionsData } from "@/store/slices/transactionsSlice";
import { fetchUnfinishedNotifications } from "@/store/slices/notificationsSlice";
import { initUsersList } from "@/store/slices/authSlice";

function RefreshButton() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const role = useAppSelector((state) => state.auth.role);
  const masterLoading = useAppSelector((state) => state.masterData.loading);
  const transactionsLoading = useAppSelector((state) => state.txData.loading);
  const notificationsLoading = useAppSelector(
    (state) => state.notifications.loading,
  );
  const authLoading = useAppSelector((state) => state.auth.loading);

  const isRefreshing =
    masterLoading || transactionsLoading || notificationsLoading || authLoading;

  const isAdmin = role === UserRoles.Admin || role === UserRoles.Master;

  const handleRefresh = () => {
    dispatch(initMasterData());
    dispatch(initTransactionsData());
    if (user && isAdmin) {
      dispatch(fetchUnfinishedNotifications());
    }
    if (user && role === UserRoles.Master) {
      dispatch(initUsersList());
    }
  };

  return (
    <button
      id="refresh-btn"
      title="Refresh data"
      onClick={handleRefresh}
      className={`p-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg flex-shrink-0 ${
        isRefreshing ? "text-blue-400" : ""
      }`}
      aria-label="Refresh data"
      disabled={isRefreshing}
    >
      <RefreshCw
        className={`w-5 h-5 sm:w-6 sm:h-6 ${
          isRefreshing ? "animate-spin" : ""
        }`}
      />
    </button>
  );
}

export default RefreshButton;
