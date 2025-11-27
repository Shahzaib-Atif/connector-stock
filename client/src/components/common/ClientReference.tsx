import { Users } from "lucide-react";

interface Props {
  clientName: string;
  clientRef: string;
}

function ClientReference({ clientName, clientRef }: Props) {
  return (
    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 flex items-center gap-3">
      <div className="p-2 bg-slate-800 rounded-lg text-slate-400 border border-slate-700">
        <Users className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs text-slate-500 uppercase font-bold">
          Client Reference
        </div>
        <div className="font-semibold text-slate-200">
          {clientName}{" "}
          <span className="text-slate-500 font-normal">({clientRef})</span>
        </div>
      </div>
    </div>
  );
}

export default ClientReference;
