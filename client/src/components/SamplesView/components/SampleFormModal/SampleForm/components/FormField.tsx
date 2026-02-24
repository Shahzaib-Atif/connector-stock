import React from "react";
import { Calendar, FolderOpen } from "lucide-react";
import AutocompleteField from "@/components/common/AutocompleteField";
import { inputClass, labelClass } from "./SampleFormFields";

interface FormFieldProps {
  label: string;
  name: string;
  value: string | boolean | number;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onFolderPick?: (name: string, folderName: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "number" | "date" | "autocomplete" | "select" | "checkbox" | "folder-picker";
  fullWidth?: boolean;
  required?: boolean;
  options?: string[];
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  onFolderPick,
  placeholder,
  disabled = false,
  type = "text",
  fullWidth = false,
  required = false,
  options = [],
}) => {
  const renderInput = () => {
    const disabledClass = disabled
      ? "bg-slate-800/50 border-slate-700 opacity-60 cursor-not-allowed"
      : "";

    switch (type) {
      // AUTOCOMPLETE FIELD
      case "autocomplete":
        return (
          <AutocompleteField
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            options={options}
          />
        );

      // SELECT FIELD
      case "select":
        return (
          <select
            name={name}
            value={(value as string) || ""}
            onChange={onChange}
            className={`${inputClass} ${disabledClass} pr-10`}
            disabled={disabled}
            required={required}
          >
            <option value="">Select an option</option>
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      // CHECKBOX FIELD
      case "checkbox":
        return (
          <div
            className={`flex items-center gap-3 h-full rounded-lg border border-slate-600 bg-slate-700/40 px-4 py-3 ${
              disabled ? "opacity-50 grayscale" : ""
            }`}
          >
            <input
              type="checkbox"
              name={name}
              checked={Boolean(value)}
              onChange={onChange}
              disabled={disabled}
              className="h-5 w-5 rounded border-slate-500 bg-slate-800 accent-blue-500"
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-200">
                {label}
              </div>
              <div className="text-xs text-slate-400">
                Mark if the sample includes wiring
              </div>
            </div>
          </div>
        );

      // FOLDER PICKER FIELD
      case "folder-picker": {
        const handlePickFolder = async () => {
          if (!onFolderPick) return;
          try {
            const dirHandle = await (window as Window & { showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle> }).showDirectoryPicker?.();
            if (dirHandle?.name) {
              onFolderPick(name, dirHandle.name);
            }
          } catch (err) {
            // User cancelled or API unsupported — no-op
            if (err instanceof Error && err.name !== "AbortError") {
              console.error("Folder picker error:", err);
            }
          }
        };

        return (
          <div className="flex items-center gap-2">
            <input
              type="text"
              name={name}
              value={value === undefined || value === null ? "" : String(value)}
              onChange={onChange}
              className={`${inputClass} ${disabledClass} flex-1`}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
            />
            <button
              type="button"
              onClick={handlePickFolder}
              disabled={disabled}
              title="Browse folder"
              className="flex-shrink-0 p-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-300 hover:text-blue-400 hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
          </div>
        );
      }

      // DATE FIELD
      case "date":
        return (
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="date"
              name={name}
              value={(value as string) || ""}
              onChange={onChange}
              className={`${inputClass} ${disabledClass} pl-10 [color-scheme:dark]`}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
            />
          </div>
        );

      // DEFAULT INPUT FIELD (text, number, etc.)
      default:
        return (
          <input
            type={type}
            name={name}
            value={value === undefined || value === null ? "" : String(value)}
            onChange={onChange}
            className={`${inputClass} ${disabledClass}`}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            min={type === "number" ? 0 : undefined}
          />
        );
    }
  };

  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      {type !== "checkbox" && (
        <label className={labelClass}>
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {renderInput()}
    </div>
  );
};
