import { useState, useCallback } from "react";
import {
  AnaliseTabRow,
  RegAmostrasEncRow,
} from "@/types/sampleCreation";
import {
  fetchAnaliseTabData,
  fetchRegAmostrasEncData,
} from "@/api/sampleCreationApi";
import { SampleFormData } from "./useSampleForm";

type WizardStep = 1 | 2 | 3;

interface UseSampleCreationWizardReturn {
  // State
  currentStep: WizardStep;
  refCliente: string;
  analiseTabData: AnaliseTabRow[];
  regAmostrasData: RegAmostrasEncRow[];
  selectedAnaliseRow: AnaliseTabRow | null;
  selectedRegRow: RegAmostrasEncRow | null;
  loading: boolean;
  error: string | null;

  // Actions
  setRefCliente: (value: string) => void;
  searchAnaliseTab: () => Promise<void>;
  selectAnaliseRow: (row: AnaliseTabRow) => void;
  proceedToRegAmostras: () => Promise<void>;
  selectRegRow: (row: RegAmostrasEncRow) => void;
  getPrefillData: () => Partial<SampleFormData>;
  reset: () => void;
  goBack: () => void;
}

export function useSampleCreationWizard(): UseSampleCreationWizardReturn {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [refCliente, setRefCliente] = useState("");
  const [analiseTabData, setAnaliseTabData] = useState<AnaliseTabRow[]>([]);
  const [regAmostrasData, setRegAmostrasData] = useState<RegAmostrasEncRow[]>(
    []
  );
  const [selectedAnaliseRow, setSelectedAnaliseRow] =
    useState<AnaliseTabRow | null>(null);
  const [selectedRegRow, setSelectedRegRow] =
    useState<RegAmostrasEncRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAnaliseTab = useCallback(async () => {
    if (!refCliente.trim()) {
      setError("Please enter a RefCliente");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchAnaliseTabData(refCliente.trim());
      setAnaliseTabData(data);

      if (data.length === 0) {
        setError("No results found for this RefCliente");
      } else {
        setCurrentStep(2);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch AnaliseTab data"
      );
    } finally {
      setLoading(false);
    }
  }, [refCliente]);

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

  const selectRegRow = useCallback((row: RegAmostrasEncRow) => {
    setSelectedRegRow(row);
  }, []);

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

    return {
      Cliente: selectedRegRow.Cliente,
      Projeto: selectedRegRow.Projeto,
      EncDivmac: selectedRegRow.EncDivmac,
      Ref_Descricao: selectedRegRow.Ref_Descricao,
      Ref_Fornecedor: selectedRegRow.Ref_Fornecedor,
      Amostra: selectedRegRow.Amostra,
      Data_do_pedido: formatDate(selectedRegRow.Data_do_pedido),
      Data_recepcao: formatDate(selectedRegRow.Data_recepcao),
      Entregue_a: selectedRegRow.Entregue_a,
      N_Envio: selectedRegRow.N_Envio,
      Quantidade: selectedRegRow.Quantidade,
      Observacoes: selectedRegRow.Observacoes,
      NumORC: selectedRegRow.NumORC,
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
    setError(null);
  }, []);

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
      setError(null);
    }
  }, [currentStep]);

  return {
    currentStep,
    refCliente,
    analiseTabData,
    regAmostrasData,
    selectedAnaliseRow,
    selectedRegRow,
    loading,
    error,
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
