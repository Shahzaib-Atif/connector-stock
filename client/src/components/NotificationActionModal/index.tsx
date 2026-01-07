import React from "react";
import { X, Loader2, Package } from "lucide-react";

// Sub-components
import { NotificationInfo } from "./components/NotificationInfo";
import { ParsedInfo } from "./components/ParsedInfo";
import { LinkedSample } from "./components/LinkedSample";
import { LinkedConnector } from "./components/LinkedConnector";
import { useNotificationAction } from "./useNotificationAction";
import ShowSucess from "../common/ShowSucess";
import ActionButtons from "./components/ActionButtons";
import NotificationStatus from "./components/NotificationStatus";
import QuantityInput from "./components/QuantityInput";
import CustomNote from "./components/CustomNote";
import NotificationHeader from "./components/NotificationHeader";

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
    completionType,
    setCompletionType,
    customNote,
    setCustomNote,
    status,
    errorMessage,
    handleFinish,
    handleNavigateToSample,
  } = useNotificationAction(notificationId, onClose);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <NotificationHeader onClose={onClose} />

        <div className="p-6 space-y-4 max-h-[80vh] overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : status === "success" ? (
            <ShowSucess title="Request Completed!" message="Closing..." />
          ) : (
            <form onSubmit={handleFinish} className="space-y-6">
              <ParsedInfo
                conector={notification?.parsedConector}
                encomenda={notification?.parsedEncomenda}
                senderUser={notification?.SenderUser}
                senderSector={notification?.SenderSector}
              />

              <LinkedConnector
                connector={notification?.linkedConnector}
                onClose={onClose}
              />

              <LinkedSample
                sample={notification?.linkedSample}
                onNavigate={handleNavigateToSample}
              />

              <NotificationStatus
                completionType={completionType}
                maxQuantity={notification?.linkedConnector?.Qty}
                customNote={customNote}
                setCompletionType={setCompletionType}
                setCustomNote={setCustomNote}
              />

              <QuantityInput
                completionType={completionType}
                quantityInput={quantityInput}
                maxQuantity={notification?.linkedConnector?.Qty}
                setQuantityInput={setQuantityInput}
              />

              {/* Error */}
              {status === "error" && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-sm text-red-400 text-center">
                    {errorMessage}
                  </p>
                </div>
              )}

              <ActionButtons
                quantityInput={quantityInput}
                maxQuantity={notification?.linkedConnector?.Qty}
                completionType={completionType}
                customNote={customNote}
                status={status}
                setCompletionType={setCompletionType}
                onCancel={onClose}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
