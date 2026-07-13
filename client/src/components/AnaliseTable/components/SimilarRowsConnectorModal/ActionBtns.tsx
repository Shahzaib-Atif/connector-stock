interface Props {
  onOnlyThisRow: () => void;
  onApplyToAll: () => void;
  totalCount: number;
}

function ActionBtns({ onOnlyThisRow, onApplyToAll, totalCount }: Props) {
  return (
    <div className="px-6 py-4 border-t border-slate-800 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
      <button
        type="button"
        onClick={onOnlyThisRow}
        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors"
      >
        Only this row
      </button>
      <button
        type="button"
        onClick={onApplyToAll}
        className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors"
      >
        Apply to all ({totalCount} clicks)
      </button>
    </div>
  );
}

export default ActionBtns;
