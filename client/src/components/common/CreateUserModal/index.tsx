import React from "react";
import { UserPlus } from "lucide-react";
import { ModalWrapper } from "../ModalWrapper";
import CreateUserForm from "./CreateUserForm";

interface Props {
  onClose: () => void;
}

export const CreateUserModal: React.FC<Props> = ({ onClose }) => {
  return (
    <ModalWrapper
      title="Create New User"
      onClose={onClose}
      Icon={UserPlus}
      extraClasses="max-w-md"
    >
      <CreateUserForm onClose={onClose} />
    </ModalWrapper>
  );
};
