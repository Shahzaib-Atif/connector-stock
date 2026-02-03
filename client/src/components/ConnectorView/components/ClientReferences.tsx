import { Users } from "lucide-react";
import React from "react";

interface Props {
  clientReferences: string[];
}

function ClientReferences({ clientReferences }: Props) {
  return (
    <div className="mt-4 pt-4 border-t border-slate-700/50">
      <div className="flex items-center gap-2 mb-3 text-slate-400">
        <Users className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">
          RefMARCA
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {clientReferences.map((ref, index) => (
          <div
            key={index}
            className="px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 font-medium"
          >
            {ref}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientReferences;
