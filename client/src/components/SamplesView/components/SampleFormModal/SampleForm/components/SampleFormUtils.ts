import { CreateSamplesDto } from "@shared/dto/SamplesDto";

export function performValidation(formData: CreateSamplesDto) {
  // check for missing required fields
  const requiredFields: Array<{
    name: keyof CreateSamplesDto;
    label: string;
  }> = [
    { name: "Cliente", label: "Cliente" },
    { name: "Ref_Descricao", label: "Ref. Descricao" },
    { name: "Amostra", label: "Amostra" },
  ];
  const missing = requiredFields.filter((field) => !formData[field.name]);
  if (missing.length > 0) {
    const error = `Please fill in all mandatory fields: ${missing
      .map((field) => field.label)
      .join(", ")}`;
    return error; // return error message
  }

  // validate connector has minimum length 6 (except when it is "NEW")
  if (
    formData?.Amostra?.length &&
    formData.Amostra.length < 6 &&
    formData.Amostra !== "NEW"
  ) {
    return "Amostra is not valid!"; // return error message
  }

  return null; // no errors
}
