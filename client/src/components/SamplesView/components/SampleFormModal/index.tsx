import React from "react";
import { ModalWrapper } from "@/components/common/ModalWrapper";
import { FilePenLine } from "lucide-react";
import { SampleForm } from "./SampleForm";
import { CreateSamplesDto, SamplesDto } from "@shared/dto/SamplesDto";
import { LineStatusContext } from "@/utils/functions/divDesk";

interface SampleFormModalProps {
  sample: SamplesDto | null;
  onClose: () => void;
  onSuccess: () => void;
  forceCreate?: boolean;
  initialData?: Partial<CreateSamplesDto>;
  lineStatusContext?: LineStatusContext;
}

export const SampleFormModal: React.FC<SampleFormModalProps> = ({
  sample,
  onClose,
  onSuccess,
  forceCreate = false,
  initialData,
  lineStatusContext,
}) => {
  const isEditing = !!sample && !forceCreate;

  return (
    <ModalWrapper
      title={isEditing ? "Edit Sample" : "Create New Sample"}
      Icon={FilePenLine}
      onClose={onClose}
      extraClasses="max-w-3xl"
    >
      <SampleForm
        sample={sample}
        isEditing={isEditing}
        onSuccess={onSuccess}
        onClose={onClose}
        initialData={initialData}
        lineStatusContext={lineStatusContext}
      />
    </ModalWrapper>
  );
};
