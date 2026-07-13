import { GitBranch, X } from "lucide-react";

interface Props {
  onClose: () => void;
}

function SimilarRowsHeader({ onClose }: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <GitBranch className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Similar rows found</h3>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

export default SimilarRowsHeader;
