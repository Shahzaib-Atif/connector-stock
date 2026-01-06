import React from "react";

interface NotificationInfoProps {
  senderUser: string;
  senderSector: string;
  message: string;
}

export const NotificationInfo: React.FC<NotificationInfoProps> = ({
  senderUser,
  senderSector,
  message,
}) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
          From
        </p>
        <p className="text-white">
          {senderUser} ({senderSector})
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
          Message
        </p>
        <p className="text-slate-300 whitespace-pre-wrap text-sm">
          {message}
        </p>
      </div>
    </div>
  );
};
