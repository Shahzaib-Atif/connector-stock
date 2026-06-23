import { useState } from "react";
import { ConnectorsDimensions } from "@shared/dto/ConnectorDto";

export interface ConnectorCreateFormData {
  PosId: string;
  Cor: string;
  Vias: string;
  ConnType: string;
  Fabricante: string;
  Refabricante: string;
  Family: number;
  Qty: number;
  Qty_com_fio: number;
  Qty_sem_fio: number;
  ActualViaCount: number;
  dimensions: ConnectorsDimensions;
}

const initialFormData: ConnectorCreateFormData = {
  PosId: "",
  Cor: "",
  Vias: "",
  ConnType: "",
  Fabricante: "",
  Refabricante: "",
  Family: 1,
  Qty: 0,
  Qty_com_fio: 0,
  Qty_sem_fio: 0,
  ActualViaCount: 0,
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

  function ensureValidData(codivmac: string): boolean {
    // check PosId
    if (formData?.PosId?.length !== 4) {
      setError("PosId must be 4 characters long.");
      return false;
    } // check codivmac
    else if (codivmac.length !== 6 && codivmac.length !== 8) {
      setError("CODIVMAC must be either 6 or 8 characters long.");
      return false;
    } // check ActualViaCount
    else if (
      formData.Vias?.toUpperCase() === "X" &&
      formData.ActualViaCount < 31
    ) {
      setError(
        "As Vias is set to 'X', then ActualViaCount has to be greater than 30",
      );
      return false;
    } // everything is okay, send true
    else return true;
  }

  const handleSubmit = async (e: React.FormEvent, codivmac: string) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // apply validations
    const isValidData = ensureValidData(codivmac);
    if (!isValidData) {
      setLoading(false);
      return;
    }

    try {
      // Simulate API saving (UI only first)
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Mock creating connector:", formData);
      onSave();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to create connector");
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
