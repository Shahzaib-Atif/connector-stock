import React from "react";
import { CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import { Sample } from "@/types";

interface LinkedSampleProps {
  sample: Sample;
  onNavigate: () => void;
}

export const LinkedSample: React.FC<LinkedSampleProps> = ({
  sample,
  onNavigate,
}) => {
  if (!sample) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-yellow-400 font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          No matching sample found
        </p>
        <p className="text-slate-400 text-sm mt-1">
          The sample may not exist in the system yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-green-400 font-semibold mb-2 flex items-center gap-2">
            <CheckCircle2 size={18} />
            Sample Found
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-slate-500">Ref_Descricao:</span>
              <span className="text-white ml-2">{sample.Ref_Descricao}</span>
            </div>
            <div>
              <span className="text-slate-500">Project:</span>
              <span className="text-white ml-2">{sample.Projeto || "N/A"}</span>
            </div>
            <div>
              <span className="text-slate-500">Client:</span>
              <span className="text-white ml-2">{sample.Cliente || "N/A"}</span>
            </div>
            <div>
              <span className="text-slate-500">Quantity:</span>
              <span className="text-white ml-2">
                {sample.Quantidade || "0"}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onNavigate}
          className="ml-4 p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
          title="View Sample"
        >
          <ExternalLink size={18} />
        </button>
      </div>
    </div>
  );
};
