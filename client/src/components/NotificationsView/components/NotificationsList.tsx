import React from "react";
import { NotificationCard } from "./NotificationCard";
import { INotification } from "@/utils/types/notificationTypes";

interface NotificationsListProps {
  notifications: INotification[];
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
