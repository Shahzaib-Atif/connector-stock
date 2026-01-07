import React from "react";
import { Notification } from "@/utils/types/types";
import { NotificationCard } from "./NotificationCard";

interface NotificationsListProps {
  notifications: Notification[];
  onNotificationClick: (id: number) => void;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onNotificationClick,
}) => {
  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onClick={() => onNotificationClick(notification.id)}
        />
      ))}
    </div>
  );
};
