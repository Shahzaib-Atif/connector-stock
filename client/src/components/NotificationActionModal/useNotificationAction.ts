import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import {
  fetchNotificationWithSample,
  finishNotificationThunk,
  markAsReadThunk,
} from "@/store/slices/notificationsSlice";
import { ROUTES } from "../AppRoutes";
import { NotificationWithSample } from "@/utils/types/types";
import {
  NotificationStatusType,
  NotificationCompletionType,
} from "@/utils/types/notificationTypes";

export function useNotificationAction(
  notificationId: number,
  onClose: () => void
) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [notification, setNotification] =
    useState<NotificationWithSample>(null);
  const [loading, setLoading] = useState(true);
  const [quantityInput, setQuantityInput] = useState("");
  const [status, setStatus] = useState<NotificationStatusType>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [completionType, setCompletionType] =
    useState<NotificationCompletionType>("fulfilled");
  const [customNote, setCustomNote] = useState("");

  useEffect(() => {
    const loadNotification = async () => {
      try {
        setLoading(true);
        const result = await dispatch(
          fetchNotificationWithSample(notificationId)
        ).unwrap();
        setNotification(result);

        if (notification?.linkedConnector?.Qty == 0)
          setCompletionType("outOfStock");

        // Mark as read when opened
        if (!result.Read) {
          dispatch(markAsReadThunk(notificationId));
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to load notification");
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    loadNotification();
  }, [notificationId, dispatch]);

  useEffect(() => {
    if (completionType === "outOfStock") {
      setQuantityInput("0");
    }
  }, [completionType]);

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    let qty = 0;

    // Only parse quantity if not out of stock (where it's forced 0)
    // For "other" we might still want quantity
    if (completionType !== "outOfStock") {
      qty = parseInt(quantityInput);
      if (isNaN(qty) || qty < 0) {
        setErrorMessage("Please enter a valid quantity");
        setStatus("error");
        return;
      }

      const availableStock = notification?.linkedConnector?.Qty ?? Infinity;
      if (qty > availableStock) {
        setErrorMessage(
          `Cannot take out more than available stock (${availableStock})`
        );
        setStatus("error");
        return;
      }

      if (qty == 0 && completionType === "fulfilled") {
        setErrorMessage("Qty cannot be 0 while fulfilling the order!");
        setStatus("error");
        return;
      }
    }

    setStatus("loading");
    setErrorMessage("");

    // Construct final completion note
    let finalNote = "";
    if (completionType === "outOfStock") {
      finalNote = "Out of Stock";
    } else if (completionType === "other") {
      finalNote = `Other: ${customNote}`;
    } else {
      finalNote = "Fulfilled";
    }

    // Append custom note if provided and not "Other" (since it's already included)
    if (completionType !== "other" && customNote) {
      finalNote += ` - ${customNote}`;
    }

    try {
      await dispatch(
        finishNotificationThunk({
          id: notificationId,
          quantityTakenOut: qty,
          completionNote: finalNote,
        })
      ).unwrap();
      setStatus("success");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to finish notification");
      setStatus("error");
    }
  };

  const handleNavigateToSample = () => {
    if (notification?.linkedSample) {
      navigate(`${ROUTES.SAMPLES}/${notification.linkedSample.ID}`);
      onClose();
    }
  };

  return {
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
  };
}
