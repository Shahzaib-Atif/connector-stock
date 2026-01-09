import React from "react";
import { Package } from "lucide-react";
import { ModalWrapper } from "../common/ModalWrapper";
import { NotificationActionForm } from "./components/NotificationActionForm";

interface Props {
  notificationId: number;
  onClose: () => void;
}

export const NotificationActionModal: React.FC<Props> = ({
  notificationId,
  onClose,
}) => {
  return (
    <ModalWrapper
      title="Sample Request Details"
      Icon={Package}
      onClose={onClose}
      extraClasses="max-w-2xl"
    >
      <NotificationActionForm
        notificationId={notificationId}
        onClose={onClose}
      />
    </ModalWrapper>
  );
};
