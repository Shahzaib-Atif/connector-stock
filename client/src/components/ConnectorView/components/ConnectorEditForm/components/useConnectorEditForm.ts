import { updateConnectorApi } from "@/services/connectorService";
import { useAppDispatch } from "@/store/hooks";
import { initMasterData } from "@/store/slices/masterDataSlice";
import { ConnectorExtended } from "@/utils/types";
import { useState } from "react";
import { ConnectorFormData } from "./ConnectorFormData";
import { ConnectorsDimensions } from "@shared/dto/ConnectorDto";

export function useConnectorEditForm(
  connector: ConnectorExtended,
  onSave: () => void,
) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { details, dimensions } = connector;

  const [formData, setFormData] = useState<ConnectorFormData>({
    Cor: connector.Cor,
    Vias: connector.Vias,
    ConnType: connector.ConnType || "",
    Fabricante: details?.Fabricante || "",
    Refabricante: details?.Refabricante || "",
    Family: details?.Family || 1,
    Qty: connector.Qty || 0,
    Qty_com_fio: connector.Qty_com_fio || 0,
    Qty_sem_fio: connector.Qty_sem_fio || 0,
    ActualViaCount:
      details?.ActualViaCount || parseInt(connector.viasName || "0") || 0,
    dimensions: dimensions || {},
  });

  const setQtyField = (field: "Qty_com_fio" | "Qty_sem_fio", value: number) => {
    const val = Math.max(0, value);
    setFormData((prev) => {
      const newData = { ...prev, [field]: val };
      newData.Qty = newData.Qty_com_fio + newData.Qty_sem_fio;
      return newData;
    });
  };

  const setField = <K extends keyof ConnectorFormData>(
    field: K,
    value: ConnectorFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const setDimensionsField = (
    field: keyof ConnectorsDimensions,
    value: number | undefined,
  ) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...(prev.dimensions || {}),
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateConnectorApi(connector.CODIVMAC, formData);
      await dispatch(initMasterData());
      onSave();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to update connector");

      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    setQtyField,
    setField,
    setDimensionsField,
    handleSubmit,
  };
}
