import { useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchNotificationWithSample,
  finishNotificationThunk,
  markAsReadThunk,
} from "@/store/slices/notificationsSlice";
import {
  NotificationStatus,
  DeliveryStatus,
} from "@/utils/types/notificationTypes";
import { getErrorMsg } from "@shared/utils/getErrorMsg";
import { AppNotification } from "@shared/types/Notification";
import { WireTypes } from "@shared/enums/WireTypes";
import { ConnectorExtended } from "@/utils/types";

export function useNotificationAction(
  notificationId: number,
  onClose: () => void,
) {
  const dispatch = useAppDispatch();
  const masterData = useAppSelector((s) => s.masterData.data);

  const [notification, setNotification] = useState<AppNotification | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [quantityInput, setQuantityInput] = useState("");
  const [status, setStatus] = useState<NotificationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>(
    DeliveryStatus.Fulfilled,
  );
  const [customNote, setCustomNote] = useState("");
  const [subType, setSubType] = useState<string | undefined>(undefined);
  const [selectedConnectorId, setSelectedConnectorId] = useState<
    string | undefined
  >(undefined);

  const connectorOptions = useMemo(() => {
    const base = notification?.parsedConector;
    const connectors = masterData?.connectors;
    if (!connectors || !base || base === "?" || notification?.linkedConnector) {
      return [];
    }

    const keys = Object.keys(connectors);
    const matches = keys.filter((k) => k === base || k.startsWith(`${base}-`));
    matches.sort();
    return matches;
  }, [
    masterData?.connectors,
    notification?.parsedConector,
    notification?.linkedConnector,
  ]);

  const effectiveConnector = useMemo(() => {
    if (notification?.linkedConnector) return notification.linkedConnector;
    if (selectedConnectorId && masterData?.connectors?.[selectedConnectorId]) {
      return masterData.connectors[selectedConnectorId] as ConnectorExtended;
    }
    return undefined;
  }, [
    masterData?.connectors,
    notification?.linkedConnector,
    selectedConnectorId,
  ]);

  useEffect(() => {
    const loadNotification = async () => {
      try {
        setLoading(true);
        const result = await dispatch(
          fetchNotificationWithSample(notificationId),
        ).unwrap();
        setNotification(result);

        // If backend couldn't match (e.g. versioned connectors), preselect first local match
        if (
          !result?.linkedConnector &&
          result?.parsedConector &&
          masterData?.connectors
        ) {
          const base = result.parsedConector;
          const keys = Object.keys(masterData.connectors);
          const matches = keys
            .filter((k) => k === base || k.startsWith(`${base}-`))
            .sort();
          if (matches.length === 1) {
            setSelectedConnectorId(matches[0]);
          }
        }

        if (result?.linkedConnector?.Qty == 0)
          setDeliveryStatus(DeliveryStatus.OutOfStock);

        // Mark as read when opened
        if (!result.Read) {
          dispatch(markAsReadThunk(notificationId));
        }
      } catch (err) {
        setErrorMessage(getErrorMsg(err, "Failed to load notification"));
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    loadNotification();
  }, [notificationId, dispatch]);

  // If notification is out of stock, force quantity to 0
  useEffect(() => {
    if (deliveryStatus === DeliveryStatus.OutOfStock) {
      setQuantityInput("0");
    }
  }, [deliveryStatus]);

  // Validate and submit the completion of the notification
  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    let qty = 0;

    // Only parse quantity if not out of stock (where it's forced 0)
    // For "other" we might still want quantity
    if (deliveryStatus !== DeliveryStatus.OutOfStock) {
      qty = parseInt(quantityInput);
      if (isNaN(qty) || qty < 0) {
        setErrorMessage("Please enter a valid quantity");
        setStatus("error");
        return;
      }

      const connector = effectiveConnector;
      const availableStock =
        subType === WireTypes.COM_FIO
          ? (connector?.Qty_com_fio ?? 0)
          : subType === WireTypes.SEM_FIO
            ? (connector?.Qty_sem_fio ?? 0)
            : (connector?.Qty ?? Infinity);

      if (qty > 0 && connector && !subType) {
        setErrorMessage("Please select wire status (c/fio or sem/fio)");
        setStatus("error");
        return;
      }

      if (qty > 0 && !connector) {
        setErrorMessage("Please select the connector version to take out from");
        setStatus("error");
        return;
      }

      if (qty > availableStock) {
        setErrorMessage(
          `Cannot take out more than available stock (${availableStock})`,
        );
        setStatus("error");
        return;
      }

      if (qty == 0 && deliveryStatus === DeliveryStatus.Fulfilled) {
        setErrorMessage("Qty cannot be 0 while fulfilling the order!");
        setStatus("error");
        return;
      }
    }

    setStatus("loading");
    setErrorMessage("");

    // Construct final completion note
    let finalNote = "";
    if (deliveryStatus === DeliveryStatus.OutOfStock) {
      finalNote = "Out of Stock";
    } else if (deliveryStatus === DeliveryStatus.Other) {
      finalNote = `Obs: ${customNote}`;
    } else {
      finalNote = "Delivery in progress";
    }

    // Append custom note if provided and not "Other" (since it's already included)
    if (deliveryStatus !== DeliveryStatus.Other && customNote) {
      finalNote += ` - ${customNote}`;
    }

    try {
      await dispatch(
        finishNotificationThunk({
          id: notificationId,
          quantityTakenOut: qty,
          subType: subType as WireTypes,
          connectorId: selectedConnectorId,
          completionNote: finalNote,
        }),
      ).unwrap();
      setStatus("success");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMessage(getErrorMsg(err, "Failed to finish notification"));
      setStatus("error");
    }
  };

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
