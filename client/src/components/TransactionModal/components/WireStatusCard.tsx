import { WireTypes } from "@/utils/types";

interface Props {
  subType: string;
  setSubType: (value: string) => void;
}

const labels = [
  { label: "c/fio", value: WireTypes.COM_FIO },
  { label: "sem/fio", value: WireTypes.SEM_FIO },
];

function WireStatusCard({ subType, setSubType }: Props) {
  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-xl border transition-all ${
        !subType
          ? "bg-amber-500/5 border-amber-500/20"
          : "bg-slate-700/30 border-slate-600/50"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Wire Status
        </span>
        {!subType && (
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter animate-pulse">
            Required
          </span>
        )}
      </div>

      {/* buttons */}
      <div className="flex gap-2">
        {labels.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setSubType(opt.value)}
            className={`flex-1 py-2 text-[12px] font-bold rounded-lg border transition-all ${
              subType === opt.value
                ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                : "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default WireStatusCard;
