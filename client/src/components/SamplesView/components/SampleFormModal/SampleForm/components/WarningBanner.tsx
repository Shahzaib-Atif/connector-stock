import React from "react";

interface WarningBannerProps {
  message: string;
  onAction: () => void;
  onProceed: (e: React.FormEvent, skipWarning?: boolean) => Promise<void>;
  actionLabel?: string;
  proceedLabel?: string;
}

export const WarningBanner: React.FC<WarningBannerProps> = ({
  message,
  onAction,
  onProceed,
  actionLabel = "Add Connector",
  proceedLabel = "Proceed Anyway",
}) => {
  return (
    <div className="p-4 mb-4 bg-orange-200 border border-yellow-200 rounded-lg shadow-sm">
      <p className="mb-2 text-sm text-yellow-800">{message}</p>
      <div className="flex space-x-2">
        <button
          type="button"
          className={`${btnClass} bg-blue-600  hover:bg-blue-700 focus:ring-blue-500`}
          onClick={onAction}
        >
          {actionLabel}
        </button>
        <button
          type="button"
          className={`${btnClass} bg-gray-600 hover:bg-gray-700 focus:ring-gray-500`}
          onClick={(e) => onProceed(e, true)}
        >
          {proceedLabel}
        </button>
      </div>
    </div>
  );
};

export default WarningBanner;

const btnClass =
  "px-3 py-1 text-sm font-medium text-white rounded focus:outline-none focus:ring-2";
