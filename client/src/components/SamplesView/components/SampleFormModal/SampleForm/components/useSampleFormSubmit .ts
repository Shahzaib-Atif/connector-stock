import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { performValidation } from "./SampleFormUtils";
import {
  createSampleThunk,
  updateSampleThunk,
} from "@/store/slices/samplesSlice";
import useMissingConnectorWarning from "./useMissingConnectorWarning";
import { CreateSamplesDto, SamplesDto } from "@shared/dto/SamplesDto";
import { getErrorMsg } from "@shared/utils/getErrorMsg";
import { useState } from "react";
import { LineStatusContext, setLineStatus } from "@/utils/functions/divDesk";

interface Props {
  formData: CreateSamplesDto;
  isEditing: boolean;
  sample: SamplesDto | null;
  selectedAccessoryIds: number[];
  onSuccess: () => void;
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
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { checkConnectorWarning } = useMissingConnectorWarning(); // check missing connector warning

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Perform Validations for missing fields and Amostra length
    const isError = performValidation(formData);
    if (isError) {
      setFormError(isError);
      return;
    }

    // Handle missing connector warning
    if (!checkConnectorWarning(formData.Amostra ?? "", setFormError)) return;

    // Proceed to create or update sample
    await createOrUpdateSample();
  };

  // Function to create or update sample based on the form state
  const createOrUpdateSample = async () => {
    try {
      const currentUser = user || "system";

      // If editing, update the sample; otherwise, create a new one
      if (isEditing && sample) {
        await updateSample(sample, currentUser);
      } else {
        await createSample(currentUser);
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      setFormError(
        getErrorMsg(err, "Failed to save sample. Please try again."),
      );
    }
  };

  const updateSample = async (sample: SamplesDto, currentUser: string) => {
    await dispatch(
      updateSampleThunk({
        id: sample.ID,
        data: {
          ...formData,
          Amostra: formData.Amostra?.toUpperCase(),
          LasUpdateBy: currentUser,
          ActualUser: currentUser,
          associatedItemIds: selectedAccessoryIds,
        },
      }),
    ).unwrap();
  };

  const createSample = async (currentUser: string) => {
    await dispatch(
      createSampleThunk({
        ...formData,
        Amostra: formData.Amostra?.toUpperCase(),
        CreatedBy: currentUser,
        ActualUser: currentUser,
        associatedItemIds: selectedAccessoryIds,
      }),
    ).unwrap();

    if (lineStatusContext?.enc && lineStatusContext.line) {
      await setLineStatus(
        lineStatusContext.enc,
        lineStatusContext.line,
        user ?? "system",
      );
    }
  };

  return { handleSubmit, formError };
};
