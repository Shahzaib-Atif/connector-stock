import React from "react";
import { X, Loader2, CheckCircle2, Package } from "lucide-react";

// Sub-components
import { NotificationInfo } from "./components/NotificationInfo";
import { ParsedInfo } from "./components/ParsedInfo";
import { LinkedSample } from "./components/LinkedSample";
import { FinishForm } from "./components/FinishForm";

// Hook
import { useNotificationAction } from "./useNotificationAction";

interface Props {
  notificationId: number;
  onClose: () => void;
}

export const NotificationActionModal: React.FC<Props> = ({
  notificationId,
  onClose,
}) => {
  const {
    notification,
    loading,
    quantityInput,
    setQuantityInput,
    status,
    errorMessage,
    handleFinish,
    handleNavigateToSample,
  } = useNotificationAction(notificationId, onClose);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              Sample Request Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : status === "success" ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-3">
              <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
              <p className="text-xl font-bold text-white">Request Completed!</p>
              <p className="text-slate-400">Closing...</p>
            </div>
          ) : (
            <>
              <NotificationInfo
                senderUser={notification?.SenderUser}
                senderSector={notification?.SenderSector}
                message={notification?.Message}
              />

              <ParsedInfo
                conector={notification?.parsedConector}
                encomenda={notification?.parsedEncomenda}
              />

              <LinkedSample
                sample={notification?.linkedSample}
                onNavigate={handleNavigateToSample}
              />

              <FinishForm
                quantityInput={quantityInput}
                setQuantityInput={setQuantityInput}
                onSubmit={handleFinish}
                status={status}
                errorMessage={errorMessage}
                onCancel={onClose}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
