import React from "react";
import { Sample } from "@/utils/types";
import { ModalWrapper } from "@/components/common/ModalWrapper";
import { FilePenLine } from "lucide-react";
import { SampleForm } from "./components/SampleForm";

interface SampleFormModalProps {
  sample: Sample | null;
  onClose: () => void;
  onSuccess: () => void;
  forceCreate?: boolean;
}

export const SampleFormModal: React.FC<SampleFormModalProps> = ({
  sample,
  onClose,
  onSuccess,
  forceCreate = false,
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
      />
    </ModalWrapper>
  );
};
