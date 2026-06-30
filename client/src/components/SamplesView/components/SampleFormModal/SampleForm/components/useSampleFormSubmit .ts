import { useAppSelector } from "@/store/hooks";
import { performValidation } from "./SampleFormUtils";
import { createSample, updateSample } from "@/api/samplesApi";
import useMissingConnectorWarning from "./useMissingConnectorWarning";
import { CreateSamplesDto, SamplesDto } from "@shared/dto/SamplesDto";
import { getErrorMsg } from "@shared/utils/getErrorMsg";
import { useState } from "react";
import { setLineStatus, updateConnName } from "@/utils/functions/divDesk";
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
  const [pendingConnectorUpdate, setPendingConnectorUpdate] = useState<{
    enc: string;
    line: number;
    con: string;
  } | null>(null);

  const { user } = useAppSelector((state) => state.auth);
  const { checkConnectorWarning, warningMessage, clearWarning } =
    useMissingConnectorWarning();

  const handleSubmit = async (e: React.FormEvent, skipWarning = false) => {
    e.preventDefault();
    setFormError(null);

    const isError = performValidation(formData);
    if (isError) {
      setFormError(isError);
      return;
    }

    if (!skipWarning && !checkConnectorWarning(formData.Amostra?.trim() ?? ""))
      return;

    await createOrUpdateSample();
    clearWarning();
  };

  const createOrUpdateSample = async () => {
    setLoading(true);
    try {
      const currentUser = user || "system";
      const commonPayload = {
        ...formData,
        Amostra: formData.Amostra?.trim().toUpperCase(),
        ActualUser: currentUser,
        associatedItemIds: selectedAccessoryIds,
      };

      if (isEditing && sample) {
        await updateSample(sample.ID, {
          ...commonPayload,
          LasUpdateBy: currentUser,
        });
      } else {
        await createSample({ ...commonPayload, CreatedBy: currentUser });

        if (lineStatusContext?.enc && lineStatusContext.line) {
          await setLineStatus(
            lineStatusContext.enc,
            lineStatusContext.line,
            user ?? "undefined",
          );

          // If the user changed the connector name (Amostra) in the final form, prompt them to update it
          const newCon = formData.Amostra?.trim();
          const oldCon = lineStatusContext.originalConnector?.trim() || "";
          if (newCon && newCon !== oldCon) {
            setPendingConnectorUpdate({
              enc: lineStatusContext.enc,
              line: lineStatusContext.line,
              con: newCon,
            });
            setLoading(false);
            return;
          }
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

  const handleUpdateConnectorName = async () => {
    if (!pendingConnectorUpdate) return;
    setLoading(true);
    try {
      await updateConnName({
        enc: pendingConnectorUpdate.enc,
        line: pendingConnectorUpdate.line,
        con: pendingConnectorUpdate.con,
        userAgent: user || "undefined",
      });
      await onSuccess();
    } catch (err) {
      console.error(err);
      setFormError(
        getErrorMsg(err, "Failed to update connector name. Please try again."),
      );
    } finally {
      setLoading(false);
      setPendingConnectorUpdate(null);
    }
  };

  const handleSkipConnectorUpdate = () => {
    setPendingConnectorUpdate(null);
    void onSuccess();
  };

  return {
    handleSubmit,
    formError,
    loading,
    pendingConnectorUpdate,
    handleUpdateConnectorName,
    handleSkipConnectorUpdate,
    warningMessage,
    clearWarning,
  };
};
