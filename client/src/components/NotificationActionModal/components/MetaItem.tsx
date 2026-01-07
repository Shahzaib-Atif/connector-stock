interface Props {
  label: string;
  value: string;
}

function MetaItem({ label, value }: Props) {
  return (
    <div>
      <span className="text-slate-500">{label}: </span>
      <span className="text-white">{value || "--"}</span>
    </div>
  );
}

export default MetaItem;
