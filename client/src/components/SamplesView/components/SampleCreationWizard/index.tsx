import React from "react";
import { ModalWrapper } from "@/components/common/ModalWrapper";
import { Database } from "lucide-react";
import { useSampleCreationWizard } from "@/hooks/useSampleCreationWizard";
import WizardStep1 from "./components/WizardStep1";
import WizardStep2 from "./components/WizardStep2";
import WizardStep3 from "./components/WizardStep3";
import { SampleFormData } from "@/hooks/useSampleForm";

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
    <ModalWrapper
      title={`Sample Creation Wizard - Step ${currentStep} of 3`}
      Icon={Database}
      onClose={onClose}
      extraClasses="max-w-7xl"
    >
      <>
        {currentStep === 1 && (
          <WizardStep1
            refCliente={refCliente}
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
          <WizardStep3
            error={error}
            goBack={goBack}
            handleCreateRegister={handleCreateRegister}
            regAmostrasData={regAmostrasData}
            reset={reset}
            selectRegRow={selectRegRow}
            selectedRegRow={selectedRegRow}
          />
        )}
      </>
    </ModalWrapper>
  );
};
