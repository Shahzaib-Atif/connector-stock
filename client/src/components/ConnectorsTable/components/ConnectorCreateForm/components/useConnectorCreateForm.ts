import { useState } from "react";
import {
  ConnectorsDetails,
  ConnectorsDimensions,
} from "@shared/dto/ConnectorDto";
import { createConnector } from "@/api/connectorApi";
import { CreateConnectorDto } from "@shared/dto/ConnectorDto";
import { ensureValidData } from "./utils";
import { useAppSelector } from "@/store/hooks";

export interface ConnectorCreateFormData {
  PosId: string;
  Cor: string;
  Vias: string;
  ConnType: string;
  Qty: number;
  Qty_com_fio: number;
  Qty_sem_fio: number;
  details: ConnectorsDetails;
  dimensions: ConnectorsDimensions;
}

const initialFormData: ConnectorCreateFormData = {
  PosId: "",
  Cor: "",
  Vias: "",
  ConnType: "",
  Qty: 0,
  Qty_com_fio: 0,
  Qty_sem_fio: 0,
  details: {
    Family: 1,
    Fabricante: "",
    Refabricante: "",
    ActualViaCount: 0,
    CapotAngle: "",
    ClipColor: "",
    OBS: "",
  },
  dimensions: {
    InternalDiameter: null,
    ExternalDiameter: null,
    Thickness: null,
  },
};

export function useConnectorCreateForm(onSave: () => void) {
  const [formData, setFormData] =
    useState<ConnectorCreateFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);

  const setQtyField = (field: "Qty_com_fio" | "Qty_sem_fio", value: number) => {
    const val = Math.max(0, value);
    setFormData((prev) => {
      const newData = { ...prev, [field]: val };
      newData.Qty = newData.Qty_com_fio + newData.Qty_sem_fio;
      return newData;
    });
  };

  const setField = <K extends keyof ConnectorCreateFormData>(
    field: K,
    value: ConnectorCreateFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const setDimensionsField = (
    field: keyof ConnectorsDimensions,
    value: number | null,
  ) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [field]: value,
      },
    }));
  };

  const setDetailsField = (
    field: keyof ConnectorsDetails,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent, codivmac: string) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const errorMsg = ensureValidData(codivmac, formData);
    if (errorMsg) {
      setLoading(false);
      setError(errorMsg);
      return;
    }

    try {
      const payload: CreateConnectorDto = {
        ...formData,
        LastChangeBy: user || "web",
        details: {
          ...formData.details,
        },
        dimensions:
          formData.dimensions.InternalDiameter != null ||
          formData.dimensions.ExternalDiameter != null ||
          formData.dimensions.Thickness != null
            ? formData.dimensions
            : null,
      };

      await createConnector(payload);
      setFormData(initialFormData);
      onSave();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to create connector");
    } finally {
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
    setDetailsField,
    handleSubmit,
  };
}
