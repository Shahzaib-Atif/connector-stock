import { Loader2, Plus, X } from "lucide-react";

interface Props {
  onCancel: () => void;
  loading: boolean;
}

function FormActionBtns({ onCancel, loading }: Props) {
  return (
    <div className="flex gap-3 pt-4 border-t border-slate-800">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all"
      >
        <X className="w-4 h-4" />
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Create Connector
          </>
        )}
      </button>
    </div>
  );
}

export default FormActionBtns;
