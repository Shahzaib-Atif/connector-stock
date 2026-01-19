import { SampleFormData } from "@/hooks/useSampleForm";

export interface FORM_FIELDS_Type {
  name: keyof SampleFormData;
  label: string;
  placeholder: string;
  disabledOnEdit?: boolean;
  type?: "text" | "number" | "date" | "autocomplete" | "select" | "checkbox";
  fullWidth?: boolean;
  required?: boolean;
  options?: string[];
}
