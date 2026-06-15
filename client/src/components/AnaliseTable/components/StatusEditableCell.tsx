import { Check, Pencil, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Props {
  initialValue: string;
  isAdmin: boolean;
  isSaving?: boolean;
  onSave: (newValue: string) => void | Promise<void>;
}

// Inline dropdown editor for analise production line status (Estado).
export default function StatusEditableCell({
  initialValue,
  isAdmin,
  isSaving = false,
  onSave,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  // Sync state if initialValue changes externally
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!isAdmin) {
    return <span>{initialValue || "-"}</span>;
  }

  // Persists the new status if changed.
  const handleSave = async () => {
    if (value !== initialValue) {
      await onSave(value);
    }
    setIsEditing(false);
  };

  // Reverts edit mode without saving.
  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  // Handles Enter save and Escape cancel.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === "Enter") {
      void handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div
        className="flex items-center gap-1.5 w-full min-w-[100px]"
        onClick={(e) => e.stopPropagation()}
      >
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-slate-900 border border-slate-700 text-slate-100 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
          autoFocus
        >
          <option key={"FA"}>FA</option>
          <option key={"AN"}>AN</option>
        </select>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={isSaving}
          title="Save"
          className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors shrink-0 disabled:opacity-50"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          title="Cancel"
          className="p-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:text-rose-300 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 group rounded px-1.5 py-0.5 -mx-1.5 -my-0.5 transition-colors duration-150">
      <span>{initialValue || "-"}</span>
      {initialValue === "FA" && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          title="Edit Status"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-blue-400 shrink-0 cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5 text-slate-500" />
        </button>
      )}
    </div>
  );
}
