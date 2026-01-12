interface Props {
  label: string;
  value: string;
  classnames?: string;
}

function CardInfoDiv({ label, value, classnames = "" }: Props) {
  return (
    <div
      id={"card-info " + label}
      className={
        "p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 " +
        classnames
      }
    >
      <div className="text-xs sm:text-sm text-slate-500 uppercase font-bold mb-1">
        {label}
      </div>
      <div className="text-sm sm:text-lg text-slate-200 gap-2 break-all">
        {value}
      </div>
    </div>
  );
}

export default CardInfoDiv;
