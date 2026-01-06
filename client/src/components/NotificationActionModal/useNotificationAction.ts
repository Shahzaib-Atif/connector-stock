import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import {
  fetchNotificationWithSample,
  finishNotificationThunk,
  markAsReadThunk,
} from "@/store/slices/notificationsSlice";
import { ROUTES } from "../AppRoutes";

export function useNotificationAction(notificationId: number, onClose: () => void) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [notification, setNotification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantityInput, setQuantityInput] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadNotification = async () => {
      try {
        setLoading(true);
        const result = await dispatch(
          fetchNotificationWithSample(notificationId)
        ).unwrap();
        setNotification(result);

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

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();

    const qty = parseInt(quantityInput);
    if (isNaN(qty) || qty <= 0) {
      setErrorMessage("Please enter a valid quantity");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      await dispatch(
        finishNotificationThunk({
          id: notificationId,
          quantityTakenOut: qty,
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
    status,
    errorMessage,
    handleFinish,
    handleNavigateToSample,
  };
}
