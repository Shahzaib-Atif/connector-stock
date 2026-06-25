import { ConnectorCreateFormData } from "./useConnectorCreateForm";

export function ensureValidData(
  codivmac: string,
  formData: ConnectorCreateFormData,
): string {
  if (formData?.PosId?.length !== 4) {
    return "PosId must be 4 characters long.";
  } else if (codivmac.length !== 6 && codivmac.length !== 8) {
    return "CODIVMAC must be either 6 or 8 characters long.";
  } else if (
    formData.Vias?.toUpperCase() === "X" &&
    (formData.details.ActualViaCount ?? 0 < 31)
  ) {
    return "As Vias is set to 'X', then ActualViaCount has to be greater than 30";
  } else return "";
}
