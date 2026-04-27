import { useState, useCallback } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  fetchAnaliseTabData,
  fetchRegAmostrasEncData,
} from "@/api/sampleCreationApi";
import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import { RegAmostrasEncDto } from "@shared/dto/RegAmostrasEncDto";
import { RegAmostrasOrcDto } from "@shared/dto/RegAmostrasOrcDto";
import { CreateSamplesDto } from "@shared/dto/SamplesDto";

type WizardStep = 1 | 2 | 3;
export type WizardFlow = "ECL" | "ORC";

interface UseSampleCreationWizardReturn {
  // State
  currentStep: WizardStep;
  refCliente: string;
  analiseTabData: AnaliseTabDto[];
  regAmostrasData: (RegAmostrasEncDto | RegAmostrasOrcDto)[];
  selectedAnaliseRow: AnaliseTabDto | null;
  selectedRegRow: (RegAmostrasEncDto | RegAmostrasOrcDto) | null;
  flow: WizardFlow;
  loading: boolean;
  error: string | null;

  // Actions
  setFlow: (flow: WizardFlow) => void;
  setRefCliente: (value: string) => void;
  searchAnaliseTab: () => Promise<void>;
  selectAnaliseRow: (row: AnaliseTabDto) => void;
  proceedToRegAmostras: () => Promise<void>;
  selectRegRow: (row: RegAmostrasEncDto | RegAmostrasOrcDto) => void;
  getPrefillData: () => Partial<CreateSamplesDto>;
  reset: () => void;
  goBack: () => void;
}

export function useSampleCreationWizard(): UseSampleCreationWizardReturn {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [refCliente, setRefCliente] = useState("");
  const [analiseTabData, setAnaliseTabData] = useState<AnaliseTabDto[]>([]);
  const [regAmostrasData, setRegAmostrasData] = useState<
    (RegAmostrasEncDto | RegAmostrasOrcDto)[]
  >([]);
  const [selectedAnaliseRow, setSelectedAnaliseRow] =
    useState<AnaliseTabDto | null>(null);
  const [selectedRegRow, setSelectedRegRow] = useState<
    (RegAmostrasEncDto | RegAmostrasOrcDto) | null
  >(null);
  const [flow, setFlow] = useState<WizardFlow>("ECL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { orcSamples } = useAppSelector((state) => state.samples);

  const searchAnaliseTab = useCallback(async () => {
    if ((flow === "ECL" || flow === "ORC") && !refCliente.trim()) {
      setError(
        `Please enter a ${
          flow === "ECL" ? "RefCliente" : "Budget Number (ORC)"
        }`,
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
        const searchTerm = refCliente.trim().toLowerCase();
        // Filter from Redux cache
        const data = orcSamples.filter(
          (s) =>
            s.orcDoc.toLowerCase().includes(searchTerm) ||
            s.CDU_ModuloRefCliente.toLowerCase().includes(searchTerm),
        );

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
  }, [refCliente, flow, orcSamples]);

  const selectAnaliseRow = useCallback((row: AnaliseTabDto) => {
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
        selectedAnaliseRow.Conector,
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
          : "Failed to fetch RegAmostrasEnc data",
      );
    } finally {
      setLoading(false);
    }
  }, [selectedAnaliseRow]);

  const selectRegRow = useCallback(
    (row: RegAmostrasEncDto | RegAmostrasOrcDto) => {
      setSelectedRegRow(row);

      // Validate that ID is 0 (meaning no register exists yet)
      if (row.ID !== 0) {
        setError(
          "Cannot create a register for a row that has already been registered (ID != 0).",
        );
      } else {
        setError(null);
      }
    },
    [],
  );

  const getPrefillData = useCallback((): Partial<CreateSamplesDto> => {
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
      Data_do_pedido: formatDate(selectedRegRow.Data_do_pedido ?? ""),
      Data_recepcao: formatDate(selectedRegRow.Data_recepcao ?? ""),
      Entregue_a: selectedRegRow.Entregue_a,
      N_Envio: selectedRegRow.N_Envio,
      Quantidade: selectedRegRow.Quantidade,
      Observacoes: selectedRegRow.Observacoes,
      NumORC: orc,
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
  row: RegAmostrasEncDto | RegAmostrasOrcDto,
): row is RegAmostrasEncDto {
  return "cdu_projeto" in row;
}
