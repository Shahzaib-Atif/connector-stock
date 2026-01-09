import { updateConnectorApi } from "@/services/connectorService";
import { useAppDispatch } from "@/store/hooks";
import { initMasterData } from "@/store/slices/masterDataSlice";
import { Connector } from "@/utils/types/types";
import { useState } from "react";

interface ConnectorFormData {
  Cor: string;
  Vias: string;
  ConnType: string;
  Fabricante: string;
  Family: number;
  Qty: number;
}

export function useConnectorEditForm(connector: Connector, onSave: () => void) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { details: connDetails } = connector;

  const [formData, setFormData] = useState<ConnectorFormData>({
    Cor: connector.Cor,
    Vias: connector.Vias,
    ConnType: connector.ConnType,
    Fabricante: connDetails.Fabricante === "--" ? "" : connDetails.Fabricante,
    Family: connDetails.Family || 1,
    Qty: connector.Qty || 0,
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
      await updateConnectorApi(connector.CODIVMAC, formData);
      await dispatch(initMasterData());
      onSave();
    } catch (err) {
      setError(err.message || "Failed to update connector");
      setLoading(false);
    }
  };

  return { formData, loading, error, setQty, setField, handleSubmit };
}
