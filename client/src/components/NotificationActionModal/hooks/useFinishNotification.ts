import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { finishNotificationThunk } from "@/store/slices/notificationsSlice";
import { DeliveryStatus } from "@/utils/types/notificationTypes";
import { WireTypes } from "@shared/enums/WireTypes";
import { getErrorMsg } from "@shared/utils/getErrorMsg";
import { ConnectorDto } from "@shared/dto/ConnectorDto";
import { RequestState } from "@/utils/types/RequestState";

interface Params {
  notificationId: number;
  onClose: () => void;

  deliveryStatus: DeliveryStatus;
  setQuantityInput: (v: string) => void;

  quantityInput: string;
  customNote: string;
  subType: string | undefined;
  connectorId: string | undefined;
  effectiveConnector: ConnectorDto | undefined;
  connectorOptions: string[];

  setStatus: (s: RequestState) => void;
  setErrorMessage: (m: string) => void;
}

export function useFinishNotification({
  notificationId,
  onClose,
  deliveryStatus,
  setQuantityInput,
  quantityInput,
  customNote,
  subType,
  connectorId,
  effectiveConnector,
  connectorOptions,
  setStatus,
  setErrorMessage,
}: Params) {
  const dispatch = useAppDispatch();

  // If notification is out of stock, force quantity to 0
  useEffect(() => {
    if (deliveryStatus === DeliveryStatus.OutOfStock) {
      setQuantityInput("0");
    }
  }, [deliveryStatus, setQuantityInput]);

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    let qty = 0;

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

      if (qty > 0 && !connector && connectorOptions.length > 0) {
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

      if (qty === 0 && deliveryStatus === DeliveryStatus.Fulfilled) {
        setErrorMessage("Qty cannot be 0 while fulfilling the order!");
        setStatus("error");
        return;
      }
    }

    setStatus("loading");
    setErrorMessage("");

    let finalNote = "";
    if (deliveryStatus === DeliveryStatus.OutOfStock) {
      finalNote = "Out of Stock";
    } else if (deliveryStatus === DeliveryStatus.Other) {
      finalNote = `Obs: ${customNote}`;
    } else {
      finalNote = "Delivery in progress";
    }

    if (deliveryStatus !== DeliveryStatus.Other && customNote) {
      finalNote += ` - ${customNote}`;
    }

    try {
      await dispatch(
        finishNotificationThunk({
          notificationId,
          quantityTakenOut: qty,
          subType: subType as WireTypes,
          connectorVersionId: connectorId,
          completionNote: finalNote,
        }),
      ).unwrap();

      setStatus("success");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setErrorMessage(getErrorMsg(err, "Failed to finish notification"));
      setStatus("error");
    }
  };

  return { handleFinish };
}
