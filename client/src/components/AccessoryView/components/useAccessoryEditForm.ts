import { updateAccessoryApi } from "@/utils/functions/accessory";
import { useAppDispatch } from "@/store/hooks";
import { initMasterData } from "@/store/slices/masterDataSlice";
import { AccessoryExtended } from "@/utils/types";
import { useState } from "react";

interface AccessoryFormData {
  CapotAngle: number;
  ClipColor: string;
  Qty: number;
}

export function useAccessoryEditForm(
  accessory: AccessoryExtended,
  onSave: () => void,
) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<AccessoryExtended>(accessory);

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
      await updateAccessoryApi(accessory.Id, formData);
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
