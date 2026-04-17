import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  fetchNotificationWithSample,
  markAsReadThunk,
} from "@/store/slices/notificationsSlice";
import { AppNotification } from "@shared/types/Notification";
import {
  DeliveryStatus,
  NotificationStatus,
} from "@/utils/types/notificationTypes";
import { getErrorMsg } from "@shared/utils/getErrorMsg";

export function useNotificationData(notificationId: number) {
  const dispatch = useAppDispatch();

  const [notification, setNotification] = useState<AppNotification | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<NotificationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>(
    DeliveryStatus.Fulfilled,
  );

  useEffect(() => {
    const loadNotification = async () => {
      try {
        setLoading(true);
        const result = await dispatch(
          fetchNotificationWithSample(notificationId),
        ).unwrap();
        setNotification(result);

        if (result?.linkedConnector?.Qty === 0) {
          setDeliveryStatus(DeliveryStatus.OutOfStock);
        }

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
  }, [dispatch, notificationId]);

  return {
    notification,
    setNotification,
    loading,
    status,
    setStatus,
    errorMessage,
    setErrorMessage,
    deliveryStatus,
    setDeliveryStatus,
  };
}

