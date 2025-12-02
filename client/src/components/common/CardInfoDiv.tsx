interface Props {
  label: string;
  value: string;
}

function CardInfoDiv({ label, value }: Props) {
  return (
    <div
      id="metadata-card-info"
      className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50"
    >
      <div className="text-xs sm:text-sm text-slate-500 uppercase font-bold mb-1">
        {label}
      </div>
      <div className="text-sm sm:text-lg font-semibold text-slate-200 gap-2">
        {value}
      </div>
    </div>
  );
}

export default CardInfoDiv;
