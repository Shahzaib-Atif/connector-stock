import { updateAccessoryApi } from "@/services/accessoryService";
import { useAppDispatch } from "@/store/hooks";
import { initMasterData } from "@/store/slices/masterDataSlice";
import { Accessory } from "@/utils/types";
import { useState } from "react";

interface AccessoryFormData {
  CapotAngle: number;
  ClipColor: string;
  Qty: number;
}

export function useAccessoryEditForm(accessory: Accessory, onSave: () => void) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Accessory>>({
    CapotAngle: accessory.CapotAngle || "",
    ClipColor: accessory.ClipColor || "",
    Qty: accessory.Qty || 0,
  });

  const setField = <K extends keyof AccessoryFormData>(
    field: K,
    value: AccessoryFormData[K],
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
      await updateAccessoryApi(accessory.id, formData);
      await dispatch(initMasterData());
      onSave();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to update accessory");

      setLoading(false);
    }
  };

  return { formData, loading, error, setField, handleSubmit };
}
