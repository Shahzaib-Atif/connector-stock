import React from "react";
import { Sample } from "@/utils/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createSampleThunk,
  updateSampleThunk,
} from "@/store/slices/samplesSlice";
import { useSampleForm, SampleFormData } from "@/hooks/useSampleForm";
import { FormField } from "./components/FormField";
import {
  FORM_FIELDS,
  labelClass,
  inputClass,
} from "./components/SampleFormFields";
import { useAssociatedAccessories } from "@/hooks/useAssociatedAccessories";
import AccessoryChecklist from "@/components/TransactionModal/components/AccessoryChecklist";
import { performValidation } from "./components/SampleFormUtils";
import useSampleOptions from "./components/useSampleOptions";
import { useConnectorId } from "./components/useConnectorId";
import useMissingConnectorWarning from "./components/useMissingConnectorWarning";
import ErrorBanner from "./components/ErrorBanner";
import ActionButtons from "./components/ActionButtons";
import getErrorMsg from "@/utils/getErrorMsg";

interface Props {
  sample: Sample | null;
  onClose: () => void;
  onSuccess: () => void;
  isEditing: boolean;
  initialData?: Partial<SampleFormData>;
}

export const SampleForm: React.FC<Props> = ({
  sample,
  onClose,
  onSuccess,
  isEditing,
  initialData,
}) => {
  const dispatch = useAppDispatch();
  const { loading, error: reduxError } = useAppSelector(
    (state) => state.samples,
  );
  const { user } = useAppSelector((state) => state.auth);
  const {
    formData,
    handleChange,
    setFieldValue,
    selectedAccessoryIds,
    setSelectedAccessoryIds,
  } = useSampleForm(sample, initialData);
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleFolderPick = React.useCallback(
    (name: string, folderName: string) => {
      setFieldValue(name as keyof typeof formData, folderName);
    },
    [setFieldValue, formData],
  );

  const connectorId = useConnectorId(formData.Amostra); // get connector ID from Amostra
  const { associatedAccessories } = useAssociatedAccessories(connectorId); // fetch associated accessories
  const { checkConnectorWarning } = useMissingConnectorWarning(); // check missing connector warning
  const { getOptions } = useSampleOptions(); // autocomplete options

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
    if (!checkConnectorWarning(formData.Amostra, setFormError)) return;

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
              Amostra: formData.Amostra,
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
            Amostra: formData.Amostra,
            CreatedBy: currentUser,
            ActualUser: currentUser,
            associatedItemIds: selectedAccessoryIds,
          }),
        ).unwrap();
      }

      onSuccess();
    } catch (err: unknown) {
      setFormError(getErrorMsg(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <ErrorBanner message={formError || reduxError || ""} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FORM_FIELDS.map((field) => (
          <FormField
            key={field.name}
            name={field.name}
            label={field.label}
            value={formData[field.name] ?? ""}
            onChange={handleChange}
            onFolderPick={
              field.type === "folder-picker" ? handleFolderPick : undefined
            }
            placeholder={field.placeholder}
            disabled={field.disabled || (field.disabledOnEdit && isEditing)}
            type={field.type}
            fullWidth={field.fullWidth}
            required={field.required}
            options={getOptions(field)}
          />
        ))}
      </div>

      {/* observation textarea*/}
      <div className="mt-4">
        <label className={labelClass}>Observações</label>
        <textarea
          name="Observacoes"
          value={formData.Observacoes}
          onChange={handleChange}
          rows={2}
          className={inputClass}
          placeholder="Notes and observations"
        />
      </div>

      {/* Associated Accessories Checklist */}
      <div className="mt-6">
        <AccessoryChecklist
          associatedAccessories={associatedAccessories}
          selectedAccessoryIds={selectedAccessoryIds}
          setSelectedAccessoryIds={setSelectedAccessoryIds}
          transactionType="IN"
        />
      </div>

      {/* Action buttons */}
      <ActionButtons
        isEditing={isEditing}
        loading={loading}
        onClose={onClose}
      />
    </form>
  );
};
