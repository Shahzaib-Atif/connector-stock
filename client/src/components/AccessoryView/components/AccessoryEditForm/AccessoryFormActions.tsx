import React from "react";
import { Loader2 } from "lucide-react";

interface Props {
  loading: boolean;
  onCancel: () => void;
}

const AccessoryFormActions: React.FC<Props> = ({ loading, onCancel }) => {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 text-slate-300 rounded-xl transition-all font-semibold"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-xl transition-all font-semibold flex items-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default AccessoryFormActions;
