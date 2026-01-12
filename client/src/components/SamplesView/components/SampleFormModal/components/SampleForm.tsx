import React from "react";
import { Sample } from "@/utils/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createSampleThunk,
  updateSampleThunk,
} from "@/store/slices/samplesSlice";
import { useSampleForm } from "@/hooks/useSampleForm";
import { FormField } from "./FormField";
import { FORM_FIELDS_Type } from "./FormFieldType";
import { FORM_FIELDS, labelClass, inputClass } from "./SampleFormFields";
import { getConnectorId } from "@/utils/idUtils";

interface Props {
  sample: Sample | null;
  onClose: () => void;
  onSuccess: () => void;
  isEditing: boolean;
}

export const SampleForm: React.FC<Props> = ({
  sample,
  onClose,
  onSuccess,
  isEditing,
}) => {
  const dispatch = useAppDispatch();
  const { loading, error: reduxError } = useAppSelector(
    (state) => state.samples
  );
  const { data: masterData } = useAppSelector((state) => state.masterData);
  const { user } = useAppSelector((state) => state.auth);
  const { formData, handleChange } = useSampleForm(sample);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Get connector options for autocomplete
  const connectorOptions = React.useMemo(() => {
    if (!masterData?.connectors) return [];
    return Object.keys(masterData.connectors).sort();
  }, [masterData]);

  // get projects and clients options from samples state
  const projectsOptions = useAppSelector((state) => state.samples.projects);
  const clientsOptions = useAppSelector((state) => state.samples.clients);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Manual Validation
    const requiredFields = FORM_FIELDS.filter((f) => f.required);
    const missing = requiredFields.filter((f) => !formData[f.name]);
    if (missing.length > 0) {
      setFormError(
        `Please fill in all mandatory fields: ${missing
          .map((f) => f.label)
          .join(", ")}`
      );
      return;
    }

    try {
      const currentUser = user || "system";

      if (isEditing && sample) {
        await dispatch(
          updateSampleThunk({
            id: sample.ID,
            data: {
              ...formData,
              Amostra: getConnectorId(formData.Amostra),
              LasUpdateBy: currentUser,
              ActualUser: currentUser,
            },
          })
        ).unwrap();
      } else {
        await dispatch(
          createSampleThunk({
            ...formData,
            Amostra: getConnectorId(formData.Amostra),
            CreatedBy: currentUser,
            ActualUser: currentUser,
          })
        ).unwrap();
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  function getOptions(field: FORM_FIELDS_Type): string[] {
    if (field.name === "Projeto") return projectsOptions;
    else if (field.name === "Amostra") return connectorOptions;
    else if (field.name === "Cliente") return clientsOptions;
    else return field.options;
  }

  const errorMessage = formError || reduxError;

  return (
    <form onSubmit={handleSubmit} className="p-6">
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FORM_FIELDS.map((field) => (
          <FormField
            key={field.name}
            name={field.name}
            label={field.label}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            disabled={field.disabledOnEdit && isEditing}
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

      {/* Action buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};
