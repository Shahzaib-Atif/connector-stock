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

interface Props {
  formData: CreateSamplesDto;
  isEditing: boolean;
  sample: SamplesDto | null;
  selectedAccessoryIds: number[];
  onSuccess: () => void;
}

export const useSampleFormSubmit = ({
  formData,
  isEditing,
  sample,
  selectedAccessoryIds,
  onSuccess,
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

  const createOrUpdateSample = async () => {
    try {
      const currentUser = user || "system";

      if (isEditing && sample) {
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
      } else {
        await dispatch(
          createSampleThunk({
            ...formData,
            Amostra: formData.Amostra?.toUpperCase(),
            CreatedBy: currentUser,
            ActualUser: currentUser,
            associatedItemIds: selectedAccessoryIds,
          }),
        ).unwrap();
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      setFormError(getErrorMsg(err));
    }
  };

  return { handleSubmit, formError };
};
