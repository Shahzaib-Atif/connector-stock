import { useAppSelector } from "@/store/hooks";
import { performValidation } from "./SampleFormUtils";
import { createSample, updateSample } from "@/api/samplesApi";
import useMissingConnectorWarning from "./useMissingConnectorWarning";
import { CreateSamplesDto, SamplesDto } from "@shared/dto/SamplesDto";
import { getErrorMsg } from "@shared/utils/getErrorMsg";
import { useState } from "react";
import { setLineStatus } from "@/utils/functions/divDesk";
import { LineStatusContext } from "@/utils/types/divDesk";

interface Props {
  formData: CreateSamplesDto;
  isEditing: boolean;
  sample: SamplesDto | null;
  selectedAccessoryIds: number[];
  onSuccess: () => void | Promise<void>;
  lineStatusContext?: LineStatusContext;
}

export const useSampleFormSubmit = ({
  formData,
  isEditing,
  sample,
  selectedAccessoryIds,
  onSuccess,
  lineStatusContext,
}: Props) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const { checkConnectorWarning } = useMissingConnectorWarning();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const isError = performValidation(formData);
    if (isError) {
      setFormError(isError);
      return;
    }

    if (!checkConnectorWarning(formData.Amostra ?? "", setFormError)) return;

    await createOrUpdateSample();
  };

  const createOrUpdateSample = async () => {
    setLoading(true);
    try {
      const currentUser = user || "system";

      if (isEditing && sample) {
        await updateSample(sample.ID, {
          ...formData,
          Amostra: formData.Amostra?.toUpperCase(),
          LasUpdateBy: currentUser,
          ActualUser: currentUser,
          associatedItemIds: selectedAccessoryIds,
        });
      } else {
        await createSample({
          ...formData,
          Amostra: formData.Amostra?.toUpperCase(),
          CreatedBy: currentUser,
          ActualUser: currentUser,
          associatedItemIds: selectedAccessoryIds,
        });

        if (lineStatusContext?.enc && lineStatusContext.line) {
          await setLineStatus(
            lineStatusContext.enc,
            lineStatusContext.line,
            user ?? "system",
          );
        }
      }

      await onSuccess();
    } catch (err) {
      console.error(err);
      setFormError(
        getErrorMsg(err, "Failed to save sample. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, formError, loading };
};
