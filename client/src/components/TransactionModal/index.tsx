import React, { useRef, useState, useMemo, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useEscKeyDown } from "@/hooks/useEscKeyDown";
import { Department } from "@/types";
import { DepartmentSelector } from "./components/DepartmentSelector";
import { QuantitySelector } from "./components/QuantitySelector";
import { TransactionHeader } from "./components/TransactionHeader";
import { useAssociatedAccessories } from "@/hooks/useAssociatedAccessories";
import AccessoryChecklist from "./components/AccessoryChecklist";

interface TransactionModalProps {
  type: "IN" | "OUT";
  targetId: string;
  onClose: () => void;
  onConfirm: (
    amount: number,
    department?: Department,
    associatedItemIds?: string[]
  ) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  type,
  targetId,
  onClose,
  onConfirm,
}) => {
  const [amount, setAmount] = useState(1);
  const [dept, setDept] = useState<Department>(Department.GT);
  const {
    selectedAccessoryIds,
    associatedAccessories,
    setSelectedAccessoryIds,
  } = useAssociatedAccessories(targetId);

  const ref = useRef(null);
  useClickOutside(ref, onClose);
  useEscKeyDown(ref, onClose);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const masterData = useAppSelector((state) => state.masterData.data);

  const currentStock = useMemo(() => {
    if (!masterData) return 0;
    // Check if targetId is an accessory (has underscore)
    if (targetId.includes("_")) {
      return masterData.accessories?.[targetId]?.Qty || 0;
    }
    // Otherwise it's a connector
    return masterData.connectors?.[targetId]?.Qty || 0;
  }, [masterData, targetId]);

  // If type is OUT, ensure amount doesn't exceed stock
  useEffect(() => {
    if (type === "OUT" && amount > currentStock) {
      setAmount(Math.max(1, currentStock));
    }
    if (type === "OUT" && currentStock === 0) {
      setAmount(0);
    }
  }, [currentStock, type]);

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

          {type === "OUT" && (
            <DepartmentSelector value={dept} onChange={setDept} />
          )}

          {!isAuthenticated && (
            <p className="text-amber-400 text-sm text-center font-medium">
              Please login to perform stock alterations
            </p>
          )}

          <button
            onClick={() => {
              if (amount > 0 && isAuthenticated) {
                onConfirm(
                  amount,
                  type === "OUT" ? dept : undefined,
                  selectedAccessoryIds
                );
              }
            }}
            className={`w-full py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-transform active:scale-[0.98] ${
              type === "IN"
                ? "btn-primary"
                : "bg-orange-600 hover:bg-orange-500"
            } ${(!isAuthenticated || amount === 0) ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!isAuthenticated || amount === 0}
          >
            CONFIRM {type === "IN" ? "ENTRY" : "WITHDRAWAL"}
          </button>
        </div>
      </div>
    </div>
  );
};
