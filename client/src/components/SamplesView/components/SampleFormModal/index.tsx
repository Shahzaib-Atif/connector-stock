import React from "react";
import { ModalWrapper } from "@/components/common/ModalWrapper";
import { FilePenLine } from "lucide-react";
import { SampleForm } from "./SampleForm";
import { CreateSamplesDto, SamplesDto } from "@shared/dto/SamplesDto";

interface SampleFormModalProps {
  sample: SamplesDto | null;
  onClose: () => void;
  onSuccess: () => void;
  forceCreate?: boolean;
  initialData?: Partial<CreateSamplesDto>;
}

export const SampleFormModal: React.FC<SampleFormModalProps> = ({
  sample,
  onClose,
  onSuccess,
  forceCreate = false,
  initialData,
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
      />
    </ModalWrapper>
  );
};
