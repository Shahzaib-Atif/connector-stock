import { useAppSelector } from "@/store/hooks";
import { updateConnName } from "@/utils/functions/divDesk";
import { Check, Pencil, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

interface Props {
  initialValue: string;
  encomenda: string;
  numLinha: number;
  isAdmin: boolean;
  onSave: (encomenda: string, numLinha: number, newValue: string) => void;
}

export default function ConnectorEditableCell({
  initialValue,
  encomenda,
  numLinha,
  isAdmin,
  onSave,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const masterData = useAppSelector((state) => state.masterData.data);
  const connectorNames = useMemo(() => {
    return masterData?.connectors ? Object.keys(masterData.connectors) : [];
  }, [masterData]);

  // Sync state if initialValue changes externally
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!isAdmin) {
    return <span className="break-all">{initialValue || "-"}</span>;
  }

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed !== initialValue) {
      updateConnName(encomenda, String(numLinha), trimmed);
      onSave(encomenda, numLinha, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div
        className="flex items-center gap-1.5 w-full min-w-[120px]"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          list="connector-suggestions"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-slate-900 border border-slate-700 text-slate-100 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
          autoFocus
        />
        <datalist id="connector-suggestions">
          {connectorNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <button
          type="button"
          onClick={handleSave}
          title="Save"
          className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors shrink-0"
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
    <div
      onClick={() => setIsEditing(true)}
      className="flex items-center justify-between gap-2 group cursor-pointer hover:bg-slate-800/40 rounded px-1.5 py-0.5 -mx-1.5 -my-0.5 transition-colors duration-150"
    >
      <span className="break-all">{initialValue || "-"}</span>
      <button
        type="button"
        title="Edit Connector"
        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-blue-400 shrink-0"
      >
        <Pencil className="w-3.5 h-3.5 text-slate-500" />
      </button>
    </div>
  );
}
