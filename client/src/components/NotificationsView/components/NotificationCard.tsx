import React from "react";
import { Bell, Package, Calendar } from "lucide-react";
import { INotification } from "@/utils/types/notificationTypes";

interface NotificationCardProps {
  notification: INotification;
  onClick: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-gray-800 rounded-lg p-4 cursor-pointer
        transition-all duration-200
        hover:bg-gray-750 hover:shadow-lg
        border-l-4 ${notification.Read ? "border-gray-600" : "border-blue-500"}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <Bell
            size={20}
            className={notification.Read ? "text-gray-500" : "text-blue-400"}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3
              className={`text-sm font-semibold ${
                notification.Read ? "text-gray-300" : "text-white"
              }`}
            >
              {notification.Title || "Sample Request"}
            </h3>
            <span className="text-xs text-gray-500">
              {formatDate(notification.CreationDate)}
            </span>
          </div>

          <div className="text-sm text-gray-400 mb-3">
            <p className="mb-1">
              <span className="text-gray-500">From:</span>{" "}
              {notification.SenderUser} ({notification.SenderSector})
            </p>
          </div>

          {notification.parsedConector && (
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded">
                <Package size={14} className="text-green-400" />
                <span className="text-gray-300">
                  Connector:{" "}
                  <span className="text-white font-mono">
                    {notification.parsedConector}
                  </span>
                </span>
              </div>

              {notification.parsedEncomenda && (
                <div className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded">
                  <Calendar size={14} className="text-yellow-400" />
                  <span className="text-gray-300">
                    Order:{" "}
                    <span className="text-white font-mono">
                      {notification.parsedEncomenda}
                    </span>
                  </span>
                </div>
              )}
            </div>
          )}

          {!notification.Read && (
            <div className="mt-2">
              <span className="inline-block text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                Unread
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
