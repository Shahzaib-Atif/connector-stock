import { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  fetchNotificationWithSample,
  finishNotificationThunk,
  markAsReadThunk,
} from "@/store/slices/notificationsSlice";
import {
  NotificationStatus,
  DeliveryStatus,
  INotification,
} from "@/utils/types/notificationTypes";
import getErrorMsg from "@/utils/getErrorMsg";

export function useNotificationAction(
  notificationId: number,
  onClose: () => void,
) {
  const dispatch = useAppDispatch();

  const [notification, setNotification] = useState<INotification | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantityInput, setQuantityInput] = useState("");
  const [status, setStatus] = useState<NotificationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>(
    DeliveryStatus.Fulfilled,
  );
  const [customNote, setCustomNote] = useState("");

  useEffect(() => {
    const loadNotification = async () => {
      try {
        setLoading(true);
        const result = await dispatch(
          fetchNotificationWithSample(notificationId),
        ).unwrap();
        setNotification(result);

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

      const availableStock = notification?.linkedConnector?.Qty ?? Infinity;
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
    status,
    errorMessage,
    handleFinish,
  };
}
