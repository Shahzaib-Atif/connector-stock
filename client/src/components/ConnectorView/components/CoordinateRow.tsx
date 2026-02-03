interface Props {
  cv: string;
  ch: string;
  label: string;
}

function CoordinateRow({ cv, ch, label }: Props) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-300 rounded-lg text-xs font-bold border border-blue-500/20">
      <span className="text-[10px] opacity-60 font-black">{label}:</span>
      {cv || "?"} | {ch || "?"}
    </div>
  );
}

export default CoordinateRow;
