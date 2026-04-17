import React from "react";
import { Loader2 } from "lucide-react";
import ShowSuccess from "@/components/common/ShowSuccess";
import { useNotificationAction } from "../useNotificationAction";
import ActionButtons from "./ActionButtons";
import { LinkedConnector } from "./LinkedConnector";
import { LinkedSample } from "./LinkedSample";
import NotificationStatus from "./NotificationStatus";
import { ParsedInfo } from "./ParsedInfo";
import QuantityInput from "./QuantityInput";
import WireStatusCard from "@/components/TransactionModal/components/WireStatusCard";
import { DeliveryStatus } from "@/utils/types/notificationTypes";
import { WireTypes } from "@shared/enums/WireTypes";

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
    deliveryStatus,
    setDeliveryStatus,
    customNote,
    setCustomNote,
    subType,
    setSubType,
    status,
    errorMessage,
    handleFinish,
  } = useNotificationAction(notificationId, onClose);

  return (
    <div className="p-6 space-y-4 max-h-[80vh] overflow-auto">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : status === "success" ? (
        <ShowSuccess title="Request Completed!" message="Closing..." />
      ) : (
        <form onSubmit={handleFinish} className="space-y-6">
          <ParsedInfo
            conector={notification?.parsedConector || ""}
            encomenda={notification?.parsedEncomenda || ""}
            prodId={notification?.parsedProdId || ""}
            senderUser={notification?.SenderUser || ""}
            senderSector={notification?.SenderSector || ""}
            wireType={notification?.parsedWireType}
            sample={notification?.parsedSample}
          />

          <LinkedConnector connector={notification?.linkedConnector} />

          <LinkedSample sample={notification?.linkedSample} />

          <NotificationStatus
            deliveryStatus={deliveryStatus}
            customNote={customNote}
            setDeliveryStatus={setDeliveryStatus}
            setCustomNote={setCustomNote}
          />

          {!!notification?.linkedConnector &&
            deliveryStatus !== DeliveryStatus.OutOfStock && (
              <WireStatusCard
                subType={subType ?? ""}
                setSubType={setSubType}
              />
            )}

          <QuantityInput
            deliveryStatus={deliveryStatus}
            quantityInput={quantityInput}
            maxQuantity={
              subType === WireTypes.COM_FIO
                ? notification?.linkedConnector?.Qty_com_fio
                : subType === WireTypes.SEM_FIO
                  ? notification?.linkedConnector?.Qty_sem_fio
                  : notification?.linkedConnector?.Qty
            }
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
            maxQuantity={
              subType === WireTypes.COM_FIO
                ? notification?.linkedConnector?.Qty_com_fio
                : subType === WireTypes.SEM_FIO
                  ? notification?.linkedConnector?.Qty_sem_fio
                  : notification?.linkedConnector?.Qty
            }
            deliveryStatus={deliveryStatus}
            customNote={customNote}
            status={status}
            onCancel={onClose}
          />
        </form>
      )}
    </div>
  );
};
