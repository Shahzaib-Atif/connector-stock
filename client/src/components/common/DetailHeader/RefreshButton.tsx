import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RefreshCw } from "lucide-react";
import { UserRoles } from "@shared/enums/UserRoles";
import { refreshMasterData } from "@/store/slices/masterDataSlice";
import { refreshTransactionsData } from "@/store/slices/transactionsSlice";
import { fetchUnfinishedNotifications } from "@/store/slices/notificationsSlice";
import { refreshUsersList } from "@/store/slices/authSlice";
import { useState } from "react";

function RefreshButton() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const role = useAppSelector((state) => state.auth.role);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isAdmin = role === UserRoles.Admin || role === UserRoles.Master;

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      const refreshJobs: Promise<unknown>[] = [
        dispatch(refreshMasterData()).unwrap(),
        dispatch(refreshTransactionsData()).unwrap(),
      ];

      if (user && isAdmin) {
        refreshJobs.push(dispatch(fetchUnfinishedNotifications()).unwrap());
      }

      if (user && role === UserRoles.Master) {
        refreshJobs.push(dispatch(refreshUsersList()).unwrap());
      }

      await Promise.all(refreshJobs);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      id="refresh-btn"
      title="Refresh data"
      onClick={handleRefresh}
      className={`p-2 link-icon rounded-lg flex-shrink-0 ${
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
