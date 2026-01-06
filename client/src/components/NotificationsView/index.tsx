import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { DetailHeader } from "../common/DetailHeader";
import Spinner from "../common/Spinner";
import { ROUTES } from "../AppRoutes";
import { fetchUnfinishedNotifications } from "@/store/slices/notificationsSlice";
import { NotificationsList } from "./components/NotificationsList";
import { NotificationActionModal } from "../NotificationActionModal";

export const NotificationsView: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notifications, loading, unfinishedCount } = useAppSelector(
    (state) => state.notifications
  );
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    number | null
  >(null);

  useEffect(() => {
    dispatch(fetchUnfinishedNotifications());
  }, [dispatch]);

  const handleNotificationClick = (id: number) => {
    setSelectedNotificationId(id);
  };

  const handleCloseModal = () => {
    setSelectedNotificationId(null);
    // Refresh notifications list after modal closes
    dispatch(fetchUnfinishedNotifications());
  };

  if (loading && notifications.length === 0) {
    return <Spinner />;
  }

  return (
    <div id="notifications-page" className="table-view-wrapper">
      <DetailHeader
        label="Notifications"
        title={`Sample Requests (${unfinishedCount})`}
        onBack={() => navigate(ROUTES.HOME)}
      />

      <div id="notifications-content" className="table-view-content">
        <div className="table-view-inner-content max-w-xl md:max-w-4xl overflow-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <p className="text-lg">No pending notifications</p>
            </div>
          ) : (
            <NotificationsList
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
            />
          )}
        </div>
      </div>

      {selectedNotificationId && (
        <NotificationActionModal
          notificationId={selectedNotificationId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
