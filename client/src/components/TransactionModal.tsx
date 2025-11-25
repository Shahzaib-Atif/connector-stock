import React, { useState } from "react";
import { X } from "lucide-react";
import { Department } from "../types";
import { DEPARTMENTS } from "../constants";

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
  const [dept, setDept] = useState<Department>(Department.ASSEMBLY);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-10 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">
            {type === "IN" ? "Add Stock" : "Remove Stock"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 bg-slate-700 rounded-full text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {targetId.includes("_") && (
            <div className="text-sm text-center bg-slate-900 p-2 rounded-lg border border-slate-700 text-slate-400">
              Adjusting Accessory:{" "}
              <span className="font-mono font-bold text-slate-200">
                {targetId}
              </span>
            </div>
          )}

          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setAmount(Math.max(1, amount - 1))}
              className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xl hover:bg-slate-600 transition-colors"
            >
              -
            </button>
            <div className="text-4xl font-bold text-white w-20 text-center">
              {amount}
            </div>
            <button
              onClick={() => setAmount(amount + 1)}
              className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xl hover:bg-slate-600 transition-colors"
            >
              +
            </button>
          </div>

          {type === "OUT" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Destination Department
              </label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value as Department)}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => onConfirm(amount, type === "OUT" ? dept : undefined)}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-[0.98] ${
              type === "IN"
                ? "btn-primary"
                : "bg-orange-600 hover:bg-orange-500"
            }`}
          >
            CONFIRM {type === "IN" ? "ENTRY" : "WITHDRAWAL"}
          </button>
        </div>
      </div>
    </div>
  );
};
