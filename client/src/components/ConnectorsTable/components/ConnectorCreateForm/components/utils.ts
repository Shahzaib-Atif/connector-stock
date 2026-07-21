import { ConnectorCreateFormData } from "./useConnectorCreateForm";

export function ensureValidData(
  codivmac: string,
  formData: ConnectorCreateFormData,
): string {
  if (formData?.PosId?.length !== 4) {
    return "PosId must be 4 characters long.";
  } else if (codivmac.length !== 6 && codivmac.length !== 8) {
    return "CODIVMAC must be either 6 or 8 characters long.";
  } else return "";
}

export function getCodivmac(formData: ConnectorCreateFormData): string {
  const hasValidPosId = formData.PosId?.length === 4;
  const versionSuffix = formData.version ? `-${formData.version}` : "";
  const codivmac = hasValidPosId
    ? `${formData.PosId}${formData.Cor}${formData.Vias}${versionSuffix}`
    : "";

  return codivmac;
}

export const inputClassEnabled =
  "input-style-main input-style-enabled appearance-none cursor-pointer";

export const inputClassDisabled =
  "input-style-main input-style-disabled appearance-none cursor-pointer opacity-40";
