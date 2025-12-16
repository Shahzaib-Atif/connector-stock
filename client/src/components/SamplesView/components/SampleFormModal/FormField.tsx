import React from "react";
import { labelClass, inputClass } from "./SampleFormFields";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "number" | "date" | "autocomplete" | "select";
  fullWidth?: boolean;
  required?: boolean;
  options?: string[]; // For autocomplete
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  type = "text",
  fullWidth = false,
  required = false,
  options = [],
}) => {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label className={labelClass}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      {type === "autocomplete" ? (
        <>
          <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className={inputClass}
            placeholder={placeholder}
            disabled={disabled}
            list={`list-${name}`}
            required={required}
          />
          <datalist id={`list-${name}`}>
            {options.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClass}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={type === "number" ? 1 : undefined}
        />
      )}
    </div>
  );
};
