import React from "react";
import { Bell, Package, Calendar, ShoppingCart, Check } from "lucide-react";
import { INotification } from "@/utils/types/notificationTypes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { markAsReadThunk } from "@/store/slices/notificationsSlice";
import { UserRoles } from "@/utils/types/userTypes";

interface NotificationCardProps {
  notification: INotification;
  onClick: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
}) => {
  const dispatch = useAppDispatch();
  const { role } = useAppSelector((state) => state.auth);

  const canMarkAsRead = role === UserRoles.Admin || role === UserRoles.Master;

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(markAsReadThunk(notification.id));
  };
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

          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="text-sm text-gray-400">
              <p className="">
                <span className="text-gray-500">From:</span>{" "}
                {notification.SenderUser} ({notification.SenderSector})
              </p>
            </div>

            {!notification.Read && canMarkAsRead && (
              <button
                onClick={handleMarkAsRead}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors group"
                title="Mark as Read"
              >
                <Check size={14} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Mark Read</span>
              </button>
            )}
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

              {notification.parsedProdId && (
                <div className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded">
                  <ShoppingCart size={14} className="text-blue-400" />
                  <span className="text-gray-300">
                    Prod Id:{" "}
                    <span className="text-white font-mono">
                      {notification.parsedProdId}
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
