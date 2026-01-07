import { updateConnectorApi } from "@/services/connectorService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initMasterData } from "@/store/slices/masterDataSlice";
import { Connector } from "@/types";
import { useState } from "react";

export interface ConnectorFormData {
  Cor: string;
  Vias: string;
  ConnType: string;
  Fabricante: string;
  Family: number;
  Qty: number;
}

export function useConnectorEditForm(connector: Connector, onSave: () => void) {
  const masterData = useAppSelector((state) => state.masterData.data);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ConnectorFormData>({
    Cor: connector.colorCode,
    Vias: connector.viasCode,
    ConnType: connector.type,
    Fabricante: connector.fabricante === "--" ? "" : connector.fabricante,
    Family: connector.family || 1,
    Qty: connector.stock || 0,
  });

  const setQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setFormData({ ...formData, Qty: Math.max(0, val) });
  };

  const setField = <K extends keyof ConnectorFormData>(
    field: K,
    value: ConnectorFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateConnectorApi(connector.id, formData);
      await dispatch(initMasterData());
      onSave();
    } catch (err: any) {
      setError(err.message || "Failed to update connector");
      setLoading(false);
    }
  };

  return { formData, loading, error, setQty, setField, handleSubmit };
}
