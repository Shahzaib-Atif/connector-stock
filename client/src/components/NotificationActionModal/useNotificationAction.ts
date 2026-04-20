import { useState } from "react";
import { useNotificationData } from "./hooks/useNotificationData";
import { useConnectorSelection } from "./hooks/useConnectorSelection";
import { useFinishNotification } from "./hooks/useFinishNotification";

export function useNotificationAction(
  notificationId: number,
  onClose: () => void,
) {
  const [quantityInput, setQuantityInput] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [subType, setSubType] = useState<string | undefined>(undefined);

  const {
    notification,
    loading,
    status,
    setStatus,
    errorMessage,
    setErrorMessage,
    deliveryStatus,
    setDeliveryStatus,
  } = useNotificationData(notificationId);

  const {
    connectorOptions,
    selectedConnectorId,
    setSelectedConnectorId,
    effectiveConnector,
  } = useConnectorSelection(notification);

  const { handleFinish } = useFinishNotification({
    notificationId,
    onClose,
    deliveryStatus,
    setQuantityInput,
    quantityInput,
    customNote,
    subType,
    connectorId: selectedConnectorId,
    effectiveConnector,
    connectorOptions,
    setStatus,
    setErrorMessage,
  });

  return {
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
    connectorOptions,
    selectedConnectorId,
    setSelectedConnectorId,
    effectiveConnector,
    status,
    errorMessage,
    handleFinish,
  };
}
