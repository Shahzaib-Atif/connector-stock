import { SampleFormData } from "@/hooks/useSampleForm";
import { FORM_FIELDS } from "./SampleFormFields";

export function performValidation(formData: SampleFormData) {
  // check for missing required fields
  const requiredFields = FORM_FIELDS.filter((f) => f.required);
  const missing = requiredFields.filter((f) => !formData[f.name]);
  if (missing.length > 0) {
    const error = `Please fill in all mandatory fields: ${missing
      .map((f) => f.label)
      .join(", ")}`;
    return error; // return error message
  }

  // validate connector has minimum length 6
  if (formData.Amostra?.length < 6) {
    return "Amostra is not valid!"; // return error message
  }

  return null; // no errors
}
