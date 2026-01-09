import React from "react";
import { Loader2 } from "lucide-react";
import ShowSucess from "@/components/common/ShowSucess";
import { useNotificationAction } from "../useNotificationAction";
import ActionButtons from "./ActionButtons";
import { LinkedConnector } from "./LinkedConnector";
import { LinkedSample } from "./LinkedSample";
import NotificationStatus from "./NotificationStatus";
import { ParsedInfo } from "./ParsedInfo";
import QuantityInput from "./QuantityInput";

interface Props {
  notificationId: number;
  onClose: () => void;
}

export const NotificationActionForm: React.FC<Props> = ({
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
              <p className="text-sm text-red-400 text-center">{errorMessage}</p>
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
  );
};
