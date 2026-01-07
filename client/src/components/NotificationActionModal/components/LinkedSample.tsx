import React from "react";
import { CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import { Sample } from "@/utils/types/types";
import MetaItem from "./MetaItem";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";

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
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-slate-500" />
        <p className="text-slate-400 text-sm">No matching sample found</p>
      </div>
    );
  }

  const { Ref_Descricao, Projeto, Cliente, Quantidade } = sample;

  return (
    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-green-400 mb-2 flex items-center gap-2">
            <CheckCircle2 size={18} />
            Sample Registry Found
          </p>
          <div className="grid gap-2 text-sm break-all">
            <MetaItem label="Ref_Descricao" value={Ref_Descricao} />
            <MetaItem label="Project" value={Projeto} />
            <MetaItem label="Client" value={Cliente} />
            <MetaItem label="Quantity" value={Quantidade || "0"} />
          </div>
        </div>
      </div>
    </div>
  );
};
