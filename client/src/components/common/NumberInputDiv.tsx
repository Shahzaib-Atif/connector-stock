interface Props {
  label: string;
  value: number | string | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  disabled?: boolean;
  min?: number;
  step?: number;
}

function NumberInputDiv({
  label,
  value,
  onChange,
  disabled,
  min,
  step,
}: Props) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={label} className="label-style-4">
        {label}
      </label>
      <input
        id={label}
        type="number"
        value={value}
        step={step}
        min={min}
        onChange={onChange}
        className={`input-style-main ${disabled ? "input-style-disabled" : "input-style-enabled"}`}
      />
    </div>
  );
}

export default NumberInputDiv;
