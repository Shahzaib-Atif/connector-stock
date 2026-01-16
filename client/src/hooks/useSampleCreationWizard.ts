import { useState, useCallback } from "react";
import {
  AnaliseTabRow,
  RegAmostrasEncRow,
  RegAmostrasOrcRow,
} from "@/types/sampleCreation";
import {
  fetchAnaliseTabData,
  fetchRegAmostrasEncData,
  fetchSamplesFromOrc,
} from "@/api/sampleCreationApi";
import { SampleFormData } from "./useSampleForm";

type WizardStep = 1 | 2 | 3;
export type WizardFlow = "ECL" | "ORC";

interface UseSampleCreationWizardReturn {
  // State
  currentStep: WizardStep;
  refCliente: string;
  analiseTabData: AnaliseTabRow[];
  regAmostrasData: (RegAmostrasEncRow | RegAmostrasOrcRow)[];
  selectedAnaliseRow: AnaliseTabRow | null;
  selectedRegRow: (RegAmostrasEncRow | RegAmostrasOrcRow) | null;
  flow: WizardFlow;
  loading: boolean;
  error: string | null;

  // Actions
  setFlow: (flow: WizardFlow) => void;
  setRefCliente: (value: string) => void;
  searchAnaliseTab: () => Promise<void>;
  selectAnaliseRow: (row: AnaliseTabRow) => void;
  proceedToRegAmostras: () => Promise<void>;
  selectRegRow: (row: RegAmostrasEncRow | RegAmostrasOrcRow) => void;
  getPrefillData: () => Partial<SampleFormData>;
  reset: () => void;
  goBack: () => void;
}

export function useSampleCreationWizard(): UseSampleCreationWizardReturn {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [refCliente, setRefCliente] = useState("");
  const [analiseTabData, setAnaliseTabData] = useState<AnaliseTabRow[]>([]);
  const [regAmostrasData, setRegAmostrasData] = useState<
    (RegAmostrasEncRow | RegAmostrasOrcRow)[]
  >([]);
  const [selectedAnaliseRow, setSelectedAnaliseRow] =
    useState<AnaliseTabRow | null>(null);
  const [selectedRegRow, setSelectedRegRow] = useState<
    (RegAmostrasEncRow | RegAmostrasOrcRow) | null
  >(null);
  const [flow, setFlow] = useState<WizardFlow>("ECL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAnaliseTab = useCallback(async () => {
    if ((flow === "ECL" || flow === "ORC") && !refCliente.trim()) {
      setError(
        `Please enter a ${
          flow === "ECL" ? "RefCliente" : "Budget Number (ORC)"
        }`
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (flow === "ECL") {
        const data = await fetchAnaliseTabData(refCliente.trim());
        setAnaliseTabData(data);

        if (data.length === 0) {
          setError("No results found for this RefCliente");
        } else {
          setCurrentStep(2);
        }
      } else if (flow === "ORC") {
        const data = await fetchSamplesFromOrc(refCliente.trim());
        setRegAmostrasData(data);
        if (data.length === 0) {
          setError(`No results found for ORC: ${refCliente}`);
        } else {
          setCurrentStep(3);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [refCliente, flow]);

  const selectAnaliseRow = useCallback((row: AnaliseTabRow) => {
    setSelectedAnaliseRow(row);
  }, []);

  const proceedToRegAmostras = useCallback(async () => {
    if (!selectedAnaliseRow) {
      setError("Please select a row");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchRegAmostrasEncData(
        selectedAnaliseRow.RefCliente,
        selectedAnaliseRow.Encomenda,
        selectedAnaliseRow.Conector
      );
      setRegAmostrasData(data);

      if (data.length === 0) {
        setError("No RegAmostrasEnc data found for this selection");
      } else {
        setCurrentStep(3);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch RegAmostrasEnc data"
      );
    } finally {
      setLoading(false);
    }
  }, [selectedAnaliseRow]);

  const selectRegRow = useCallback(
    (row: RegAmostrasEncRow | RegAmostrasOrcRow) => {
      setSelectedRegRow(row);

      // Validate that ID is 0 (meaning no register exists yet)
      if (row.ID !== 0) {
        setError(
          "Cannot create a register for a row that has already been registered (ID != 0)."
        );
      } else {
        setError(null);
      }
    },
    []
  );

  const getPrefillData = useCallback((): Partial<SampleFormData> => {
    if (!selectedRegRow) return {};

    // Format dates to YYYY-MM-DD format
    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      } catch {
        return dateString;
      }
    };

    // these values are different for both views: V_RegAmostrasEnc and V_RegAmostrasFromORC
    const enc = isEncRow(selectedRegRow)
      ? selectedRegRow.cdu_projeto
      : selectedRegRow.EncDivmac;
    const client = isEncRow(selectedRegRow)
      ? selectedRegRow.nome
      : selectedRegRow.Nome;
    const orc = isEncRow(selectedRegRow)
      ? selectedRegRow.NumORC
      : selectedRegRow.orcDoc;

    return {
      Ref_Descricao: selectedRegRow.CDU_ModuloRefCliente,
      Amostra: selectedRegRow.CDU_ModuloRefConetorDV,
      Projeto: selectedRegRow.CDU_ProjetoCliente,
      EncDivmac: enc,
      Cliente: client,
      Ref_Fornecedor: selectedRegRow.Ref_Fornecedor,
      Data_do_pedido: formatDate(selectedRegRow.Data_do_pedido),
      Data_recepcao: formatDate(selectedRegRow.Data_recepcao),
      Entregue_a: selectedRegRow.Entregue_a,
      N_Envio: selectedRegRow.N_Envio,
      Quantidade: selectedRegRow.Quantidade,
      Observacoes: selectedRegRow.Observacoes,
      NumORC: orc,
      com_fio: false,
    };
  }, [selectedRegRow]);

  const reset = useCallback(() => {
    setCurrentStep(1);
    setRefCliente("");
    setAnaliseTabData([]);
    setRegAmostrasData([]);
    setSelectedAnaliseRow(null);
    setSelectedRegRow(null);
    setFlow("ECL");
    setError(null);
  }, []);

  const goBack = useCallback(() => {
    if (currentStep === 3 && flow === "ORC") {
      setCurrentStep(1);
      setError(null);
    } else if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
      setError(null);
    }
  }, [currentStep, flow]);

  return {
    currentStep,
    refCliente,
    analiseTabData,
    regAmostrasData,
    selectedAnaliseRow,
    selectedRegRow,
    flow,
    loading,
    error,
    setFlow,
    setRefCliente,
    searchAnaliseTab,
    selectAnaliseRow,
    proceedToRegAmostras,
    selectRegRow,
    getPrefillData,
    reset,
    goBack,
  };
}

function isEncRow(
  row: RegAmostrasEncRow | RegAmostrasOrcRow
): row is RegAmostrasEncRow {
  return "cdu_projeto" in row;
}
