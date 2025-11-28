import React, { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useEscKeyDown } from "@/hooks/useEscKeyDown";
import { Department } from "@/types";
import { DepartmentSelector } from "./components/DepartmentSelector";
import { QuantitySelector } from "./components/QuantitySelector";
import { TransactionHeader } from "./components/TransactionHeader";

interface TransactionModalProps {
  type: "IN" | "OUT";
  targetId: string;
  onClose: () => void;
  onConfirm: (amount: number, department?: Department) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  type,
  targetId,
  onClose,
  onConfirm,
}) => {
  const [amount, setAmount] = useState(1);
  const [dept, setDept] = useState<Department>(Department.GT);

  const ref = useRef(null);
  useClickOutside(ref, onClose);
  useEscKeyDown(ref, onClose);

  return (
    <div
      id="transaction-modal"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        ref={ref}
        className="bg-slate-800 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-10 duration-300"
      >
        <TransactionHeader type={type} onClose={onClose} />

        <div className="space-y-6">
          {targetId.includes("_") && (
            <div className="text-sm text-center bg-slate-900 p-2 rounded-lg border border-slate-700 text-slate-400">
              Adjusting Accessory:{" "}
              <span className="font-mono font-bold text-slate-200">
                {targetId}
              </span>
            </div>
          )}

          <QuantitySelector amount={amount} onChange={setAmount} />

          {type === "OUT" && (
            <DepartmentSelector value={dept} onChange={setDept} />
          )}

          <button
            onClick={() => {
              if (amount > 0) {
                onConfirm(amount, type === "OUT" ? dept : undefined);
              }
            }}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-[0.98] ${
              type === "IN"
                ? "btn-primary"
                : "bg-orange-600 hover:bg-orange-500"
            } ${amount === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={amount === 0}
          >
            CONFIRM {type === "IN" ? "ENTRY" : "WITHDRAWAL"}
          </button>
        </div>
      </div>
    </div>
  );
};
