import React from "react";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "textarea";
  fullWidth?: boolean;
}

const inputClass =
  "w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

const labelClass = "block text-sm font-medium text-slate-300 mb-1";

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  type = "text",
  fullWidth = false,
}) => {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label className={labelClass}>{label}</label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={3}
          className={inputClass}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className={inputClass}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </div>
  );
};
