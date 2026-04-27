import { CreateSamplesDto } from "@shared/dto/SamplesDto";

export interface FORM_FIELDS_Type {
  name: keyof CreateSamplesDto;
  label: string;
  placeholder: string;
  disabledOnEdit?: boolean;
  type?: "text" | "number" | "date" | "autocomplete" | "select" | "checkbox";
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  options?: string[];
}
