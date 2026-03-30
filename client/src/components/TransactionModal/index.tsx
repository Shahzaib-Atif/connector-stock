import React, { useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useEscKeyDown } from "@/hooks/useEscKeyDown";
import { QuantitySelector } from "./components/QuantitySelector";
import { TransactionHeader } from "./components/TransactionHeader";
import { useAssociatedAccessories } from "@/hooks/useAssociatedAccessories";
import AccessoryChecklist from "./components/AccessoryChecklist";
import { Department } from "@/utils/types/shared";
import WireStatusCard from "./components/WireStatusCard";
import useStockCalculations from "./components/useStockCalculations";
import ActionButton from "./components/ActionButton";
import WithdrawalDetails from "./components/WithdrawalDetails";
import { TransactionConfirmPayload } from "@/utils/types/transactionTypes";

interface TransactionModalProps {
  transactionType: "IN" | "OUT";
  itemType: "connector" | "accessory";
  targetId: string | number;
  onClose: () => void;
  onConfirm: (data: TransactionConfirmPayload) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  transactionType,
  itemType,
  targetId,
  onClose,
  onConfirm,
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [encomenda, setEncomenda] = useState("");
  const [dept, setDept] = useState<Department>(Department.GT);

  const { currentStock, amount, subType, setSubType, setAmount } =
    useStockCalculations(targetId, transactionType, itemType);

  const {
    selectedAccessoryIds,
    associatedAccessories,
    setSelectedAccessoryIds,
  } = useAssociatedAccessories(targetId.toString());

  const ref = useRef(null);
  useClickOutside(ref, onClose);
  useEscKeyDown(ref, onClose);

  const isConnector = itemType === "connector";
  const isWireStatusSelected = subType !== undefined;
  const isOutgoingTransaction = transactionType === "OUT";

  const handleSubmit = () => {
    if (
      amount > 0 &&
      isAuthenticated &&
      (!isConnector || isWireStatusSelected)
    ) {
      onConfirm({
        amount,
        isConnector,
        associatedItemIds: selectedAccessoryIds,
        department: isOutgoingTransaction ? dept : undefined,
        subType,
        encomenda: isOutgoingTransaction ? encomenda : undefined,
      });
    }
  };

  return (
    <div
      id="transaction-modal"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        ref={ref}
        className="flex flex-col gap-8 sm:gap-12 bg-slate-800 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-10 duration-300"
      >
        <TransactionHeader
          type={transactionType}
          onClose={onClose}
          targetId={targetId?.toString()}
        />

        <div className="space-y-6 sm:space-y-10">
          {/* Wire Status Selection for Connectors */}
          {isConnector && (
            <WireStatusCard subType={subType ?? ""} setSubType={setSubType} />
          )}

          <QuantitySelector
            amount={amount}
            onChange={setAmount}
            max={isOutgoingTransaction ? currentStock : undefined}
          />

          {/* Associated Accessories Checklist */}
          <AccessoryChecklist
            associatedAccessories={associatedAccessories}
            selectedAccessoryIds={selectedAccessoryIds}
            setSelectedAccessoryIds={setSelectedAccessoryIds}
            transactionType={transactionType}
          />

          {/*  */}
          {isOutgoingTransaction && (
            <WithdrawalDetails
              dept={dept}
              setDept={setDept}
              encomenda={encomenda}
              setEncomenda={setEncomenda}
            />
          )}

          {!isAuthenticated && (
            <p className="text-amber-400 text-sm text-center font-medium">
              Please login to perform stock alterations
            </p>
          )}

          <ActionButton
            amount={amount}
            handleSubmit={handleSubmit}
            isAuthenticated={isAuthenticated}
            subType={subType ?? ""}
            type={transactionType}
            isConnector={isConnector}
          />
        </div>
      </div>
    </div>
  );
};
