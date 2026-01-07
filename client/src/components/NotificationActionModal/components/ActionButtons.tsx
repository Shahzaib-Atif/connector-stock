import { Loader2 } from "lucide-react";

interface Props {
  completionType: "fulfilled" | "outOfStock" | "other";
  maxQuantity?: number;
  quantityInput: string;
  customNote: string;
  setCompletionType: (val: "fulfilled" | "outOfStock" | "other") => void;
  onCancel: () => void;
  status: "idle" | "loading" | "success" | "error";
}

function ActionButtons({
  completionType,
  maxQuantity,
  quantityInput,
  customNote,
  status,
  setCompletionType,
  onCancel,
}: Props) {
  return (
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
        disabled={
          status === "loading" ||
          (completionType === "fulfilled" &&
            maxQuantity === 0 &&
            quantityInput !== "0" &&
            quantityInput !== "") ||
          (completionType === "other" && !customNote.trim())
        }
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
  );
}

export default ActionButtons;
