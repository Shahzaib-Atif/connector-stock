import { LineStatusContext } from "@/utils/types/divDesk";
import { CreateSamplesDto, SamplesDto } from "@shared/dto/SamplesDto";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  refetch: () => Promise<void>;
}

export default function useNewSampleModal({ refetch }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [duplicateSample, setDuplicateSample] = useState<SamplesDto | null>(
    null,
  );
  const [editingSample, setEditingSample] = useState<SamplesDto | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<
    Partial<CreateSamplesDto> | undefined
  >();
  const [lineStatusContext, setLineStatusContext] = useState<
    LineStatusContext | undefined
  >();

  const handleCreateNew: () => void = () => {
    setEditingSample(null);
    setDuplicateSample(null);
    setIsModalOpen(true);
  };

  const handleOpenWizard = () => {
    setIsWizardOpen(true);
  };

  const handleWizardClose = () => {
    setIsWizardOpen(false);
  };

  const handleSaveSuccess = async () => {
    handleModalClose();
    toast.success("Sample saved successfully!");
    await refetch();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSample(null);
    setDuplicateSample(null);
    setPrefillData(undefined);
    setLineStatusContext(undefined);
  };

  const handleEdit = (sample: SamplesDto) => {
    setEditingSample(sample);
    setDuplicateSample(null);
    setIsModalOpen(true);
  };

  const handleProceedToForm = (
    data: Partial<CreateSamplesDto>,
    statusContext?: LineStatusContext,
  ) => {
    setPrefillData(data);
    setLineStatusContext(statusContext);
    setEditingSample(null);
    setDuplicateSample(null);
    setIsModalOpen(true);
  };

  return {
    isModalOpen,
    duplicateSample,
    isWizardOpen,
    editingSample,
    lineStatusContext,
    prefillData,
    setEditingSample,
    handleCreateNew,
    handleOpenWizard,
    handleWizardClose,
    setDuplicateSample,
    setIsModalOpen,
    handleProceedToForm,
    handleSaveSuccess,
    handleModalClose,
    handleEdit,
  };
}
