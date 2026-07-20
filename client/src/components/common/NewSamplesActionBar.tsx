import useNewSampleModal from "@/hooks/useNewSampleModal";
import { SampleCreationWizard } from "../SamplesView/components/SampleCreationWizard";
import { SampleFormModal } from "../SamplesView/components/SampleFormModal";

interface Props {
  refetch: () => Promise<void>;
}

function ActionBar({ refetch }: Props) {
  const {
    isModalOpen,
    duplicateSample,
    isWizardOpen,
    editingSample,
    lineStatusContext,
    prefillData,
    handleCreateNew,
    handleOpenWizard,
    handleWizardClose,
    handleProceedToForm,
    handleSaveSuccess,
    handleModalClose,
  } = useNewSampleModal({ refetch });

  return (
    <>
      <div className="flex justify-end gap-3 flex-none">
        <button
          onClick={handleOpenWizard}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-600/30"
        >
          Create from Reference
        </button>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-600/30"
        >
          + New Sample
        </button>
      </div>

      {isWizardOpen && (
        <SampleCreationWizard
          onClose={handleWizardClose}
          onProceedToForm={handleProceedToForm}
        />
      )}

      {isModalOpen && (
        <SampleFormModal
          sample={editingSample ?? duplicateSample}
          onClose={handleModalClose}
          onSuccess={handleSaveSuccess}
          forceCreate={!!duplicateSample}
          initialData={prefillData}
          lineStatusContext={lineStatusContext}
        />
      )}
    </>
  );
}

export default ActionBar;
