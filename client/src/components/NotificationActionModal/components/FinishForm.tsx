import React from "react";
import { Loader2 } from "lucide-react";

interface FinishFormProps {
  quantityInput: string;
  setQuantityInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  status: "idle" | "loading" | "success" | "error";
  errorMessage: string;
  onCancel: () => void;
  maxQuantity?: number;
}

export const FinishForm: React.FC<FinishFormProps> = ({
  quantityInput,
  setQuantityInput,
  onSubmit,
  status,
  errorMessage,
  onCancel,
  maxQuantity,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-slate-400 mb-1.5"
        >
          Quantity Being Taken Out
        </label>
        <input
          id="quantity"
          type="number"
          min="0"
          max={maxQuantity}
          value={quantityInput}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") {
              setQuantityInput("");
            } else {
              let num = parseInt(val);
              if (!isNaN(num)) {
                if (maxQuantity !== undefined && num > maxQuantity) {
                  num = maxQuantity;
                }
                setQuantityInput(Math.max(0, num).toString());
              }
            }
          }}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
          placeholder={maxQuantity === 0 ? "Out of stock" : "Enter quantity"}
          required
          disabled={maxQuantity === 0}
        />
      </div>

      {maxQuantity === 0 && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <p className="text-sm text-amber-400 text-center font-medium">
            Connector is currently out of stock. You can still mark as finished with 0 quantity if needed.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-sm text-red-400 text-center">
            {errorMessage}
          </p>
        </div>
      )}

      <div className="pt-2 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={status === "loading" || (maxQuantity === 0 && quantityInput !== "0" && quantityInput !== "")}
          className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Mark as Finished"
          )}
        </button>
      </div>
    </form>
  );
};
