import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/fetchClient";
import { AnaliseTabRow, RegAmostrasEncRow, RegAmostrasOrcRow } from "@/types/sampleCreation";

/**
 * Fetch AnaliseTab data by RefCliente for the sample creation wizard (Step 1)
 */
export const fetchAnaliseTabData = async (
  refCliente: string
): Promise<AnaliseTabRow[]> => {
  const response = await fetchWithAuth(
    `${API.samples}/analise-tab/${encodeURIComponent(refCliente)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch AnaliseTab data");
  }
  return response.json();
};

/**
 * Fetch RegAmostrasEnc data by RefCliente for the sample creation wizard (Step 2)
 * Requires projeto and conectorDV values from the selected AnaliseTab row
 */
export const fetchRegAmostrasEncData = async (
  refCliente: string,
  projeto: string,
  conectorDV: string
): Promise<RegAmostrasEncRow[]> => {
  const response = await fetchWithAuth(
    `${API.samples}/reg-amostras-enc/${encodeURIComponent(refCliente)}?projeto=${encodeURIComponent(projeto)}&conectorDV=${encodeURIComponent(conectorDV)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch RegAmostrasEnc data");
  }
  return response.json();
};


/**
 * Fetch data starting from ORC documents
 */
export const fetchSamplesFromOrc = async (numorc: string): Promise<RegAmostrasOrcRow[]> => {
  const response = await fetchWithAuth(`${API.samples}/from-orc?numorc=${encodeURIComponent(numorc)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch samples from ORC");
  }
  return response.json();
};
