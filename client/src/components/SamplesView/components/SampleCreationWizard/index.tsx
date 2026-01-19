import React from "react";
import { useSampleCreationWizard } from "@/hooks/useSampleCreationWizard";
import { RegAmostrasEncRow, RegAmostrasOrcRow } from "@/types/sampleCreation";
import WizardStep1 from "./components/WizardStep1";
import WizardStep2 from "./components/WizardStep2";
import WizardStep3Enc from "./components/WizardStep3Enc";
import WizardStep2Orc from "./components/WizardStep2Orc";
import { SampleFormData } from "@/hooks/useSampleForm";
import SampleWizardModalHeader from "./components/SampleWizardModalHeader";

interface SampleCreationWizardProps {
  onClose: () => void;
  onProceedToForm: (prefillData: Partial<SampleFormData>) => void;
}

export const SampleCreationWizard: React.FC<SampleCreationWizardProps> = ({
  onClose,
  onProceedToForm,
}) => {
  const {
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
  } = useSampleCreationWizard();

  const handleCreateRegister = () => {
    // Validate that ID is 0
    if (selectedRegRow && selectedRegRow.ID !== 0) {
      // Error will be displayed in WizardStep3 via the error prop
      return;
    }

    const prefillData = getPrefillData();
    onProceedToForm(prefillData);
    reset();
    onClose();
  };

  return (
    <div
      id="modal-sample-wizard"
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 "
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 
      w-auto max-h-[95vh] overflow-y-auto max-w-7xl sm:min-w-[32rem]"
      >
        {/* Header */}
        <SampleWizardModalHeader
          currentStep={currentStep}
          flow={flow}
          onClose={onClose}
        />

        {/* Main Content */}
        <>
          {currentStep === 1 && (
            <WizardStep1
              refCliente={refCliente}
              flow={flow}
              setFlow={setFlow}
              setRefCliente={setRefCliente}
              searchAnaliseTab={searchAnaliseTab}
              error={error}
              loading={loading}
            />
          )}
          {currentStep === 2 && (
            <WizardStep2
              analiseTabData={analiseTabData}
              error={error}
              goBack={goBack}
              loading={loading}
              proceedToRegAmostras={proceedToRegAmostras}
              selectAnaliseRow={selectAnaliseRow}
              selectedAnaliseRow={selectedAnaliseRow}
            />
          )}
          {currentStep === 3 && (
            <>
              {flow === "ECL" ? (
                <WizardStep3Enc
                  error={error}
                  goBack={goBack}
                  handleCreateRegister={handleCreateRegister}
                  regAmostrasData={regAmostrasData as RegAmostrasEncRow[]}
                  reset={reset}
                  selectRegRow={selectRegRow as (row: RegAmostrasEncRow) => void}
                  selectedRegRow={selectedRegRow as RegAmostrasEncRow | null}
                />
              ) : (
                <WizardStep2Orc
                  error={error}
                  goBack={goBack}
                  handleCreateRegister={handleCreateRegister}
                  regAmostrasData={regAmostrasData as RegAmostrasOrcRow[]}
                  reset={reset}
                  selectRegRow={selectRegRow as (row: RegAmostrasOrcRow) => void}
                  selectedRegRow={selectedRegRow as RegAmostrasOrcRow | null}
                />
              )}
            </>
          )}
        </>

        {/* Main Content */}
      </div>
    </div>
  );
};
