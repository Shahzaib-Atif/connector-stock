import React from "react";
import { Loader2 } from "lucide-react";

interface FinishFormProps {
  quantityInput: string;
  setQuantityInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  status: "idle" | "loading" | "success" | "error";
  errorMessage: string;
  onCancel: () => void;
}

export const FinishForm: React.FC<FinishFormProps> = ({
  quantityInput,
  setQuantityInput,
  onSubmit,
  status,
  errorMessage,
  onCancel,
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
          value={quantityInput}
          onChange={(e) => setQuantityInput(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
          placeholder="Enter quantity"
          required
        />
      </div>

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
          disabled={status === "loading"}
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
