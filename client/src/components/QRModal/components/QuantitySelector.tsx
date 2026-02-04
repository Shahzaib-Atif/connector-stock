interface Props {
  printQty: number;
  setPrintQty: (value: React.SetStateAction<number>) => void;
}

export default function QuantitySelector({ printQty, setPrintQty }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        Print Quantity
      </label>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPrintQty(Math.max(1, printQty - 1))}
          className="w-8 h-8 rounded-full btn-secondary text-white flex items-center justify-center border border-slate-600 transition-colors"
        >
          -
        </button>
        <input
          type="number"
          value={printQty}
          onChange={(e) =>
            setPrintQty(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="w-16 bg-slate-900 border border-slate-700 rounded-lg py-1 text-center text-white font-bold focus:outline-none focus:border-blue-500"
          min="1"
        />
        <button
          onClick={() => setPrintQty(printQty + 1)}
          className="w-8 h-8 rounded-full btn-secondary text-white flex items-center justify-center border border-slate-600 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
