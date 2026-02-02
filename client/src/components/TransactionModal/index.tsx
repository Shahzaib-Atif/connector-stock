import React, { useRef, useState, useMemo, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useEscKeyDown } from "@/hooks/useEscKeyDown";
import { DepartmentSelector } from "./components/DepartmentSelector";
import { QuantitySelector } from "./components/QuantitySelector";
import { TransactionHeader } from "./components/TransactionHeader";
import { useAssociatedAccessories } from "@/hooks/useAssociatedAccessories";
import AccessoryChecklist from "./components/AccessoryChecklist";
import { Department } from "@/utils/types/shared";

interface TransactionModalProps {
  type: "IN" | "OUT";
  targetId: string;
  onClose: () => void;
  onConfirm: (
    amount: number,
    department?: Department,
    associatedItemIds?: string[],
    subType?: string,
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
  const [subType, setSubType] = useState<string | undefined>(undefined);

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
    const connector = masterData.connectors?.[targetId];
    if (!connector) return 0;

    if (subType === "COM_FIO") return connector.Qty_com_fio || 0;
    if (subType === "SEM_FIO") return connector.Qty_sem_fio || 0;
    return connector.Qty || 0;
  }, [masterData, targetId, subType]);

  // If type is OUT, ensure amount doesn't exceed stock
  useEffect(() => {
    if (type === "OUT" && amount > currentStock) {
      setAmount(Math.max(0, currentStock));
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
          {/* Wire Status Selection for Connectors */}
          {!targetId.includes("_") && (
            <div className="flex flex-col gap-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Wire Status
              </span>
              <div className="flex gap-2">
                {[
                  { label: "WITH WIRES", value: "COM_FIO" },
                  { label: "NO WIRES", value: "SEM_FIO" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setSubType(opt.value)}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg border transition-all ${
                      subType === opt.value
                        ? "bg-blue-600/20 border-blue-500 text-blue-300"
                        : "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
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
                  selectedAccessoryIds,
                  subType,
                );
              }
            }}
            className={`w-full py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-transform active:scale-[0.98] ${
              type === "IN"
                ? "btn-primary"
                : "bg-orange-600 hover:bg-orange-500"
            } ${
              !isAuthenticated || amount === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!isAuthenticated || amount === 0}
          >
            CONFIRM {type === "IN" ? "ENTRY" : "WITHDRAWAL"}
          </button>
        </div>
      </div>
    </div>
  );
};
