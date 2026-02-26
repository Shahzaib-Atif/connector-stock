interface Props {
  label: string;
  value: number | string | undefined;
}

function DisabledDiv({ label, value }: Props) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={label} className="label-style-4">
        {label}
      </label>
      <input
        value={value}
        disabled
        className="input-style-main input-style-disabled"
      ></input>
    </div>
  );
}

export default DisabledDiv;
