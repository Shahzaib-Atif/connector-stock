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

interface TransactionModalProps {
  type: "IN" | "OUT";
  targetId: string;
  onClose: () => void;
  onConfirm: (
    amount: number,
    department?: Department,
    associatedItemIds?: string[],
    subType?: string,
    encomenda?: string,
  ) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  type,
  targetId,
  onClose,
  onConfirm,
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [encomenda, setEncomenda] = useState("");
  const [dept, setDept] = useState<Department>(Department.GT);

  const { currentStock, amount, subType, setSubType, setAmount } =
    useStockCalculations(targetId, type);

  const {
    selectedAccessoryIds,
    associatedAccessories,
    setSelectedAccessoryIds,
  } = useAssociatedAccessories(targetId);

  const ref = useRef(null);
  useClickOutside(ref, onClose);
  useEscKeyDown(ref, onClose);

  const handleSubmit = () => {
    const isConnector = !targetId.includes("_");
    const isWireStatusSelected = subType !== undefined;

    if (
      amount > 0 &&
      isAuthenticated &&
      (!isConnector || isWireStatusSelected)
    ) {
      onConfirm(
        amount,
        type === "OUT" ? dept : undefined,
        selectedAccessoryIds,
        subType,
        type === "OUT" ? encomenda : undefined,
      );
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
        <TransactionHeader type={type} onClose={onClose} targetId={targetId} />

        <div className="space-y-6 sm:space-y-10">
          {/* Wire Status Selection for Connectors */}
          {!targetId.includes("_") && (
            <WireStatusCard subType={subType} setSubType={setSubType} />
          )}

          <QuantitySelector
            amount={amount}
            onChange={setAmount}
            max={type === "OUT" ? currentStock : undefined}
          />

          {/* Associated Accessories Checklist */}
          <AccessoryChecklist
            associatedAccessories={associatedAccessories}
            selectedAccessoryIds={selectedAccessoryIds}
            setSelectedAccessoryIds={setSelectedAccessoryIds}
            transactionType={type}
          />

          {/*  */}
          {type === "OUT" && (
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
            subType={subType}
            targetId={targetId}
            type={type}
          />
        </div>
      </div>
    </div>
  );
};
