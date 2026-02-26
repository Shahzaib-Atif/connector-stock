import React from "react";
import { useAccessoryEditForm } from "../useAccessoryEditForm";
import AccessoryFormActions from "./AccessoryFormActions";
import { Accessory } from "@/utils/types";

interface Props {
  accessory: Accessory;
  onCancel: () => void;
  onSave: () => void;
}

export const AccessoryEditForm: React.FC<Props> = ({
  accessory,
  onCancel,
  onSave,
}) => {
  const { formData, loading, error, setField, handleSubmit } =
    useAccessoryEditForm(accessory, onSave);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-5 animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          Edit Properties
        </h3>
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          {accessory.id}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Connector Name - Read Only */}
        <div className="space-y-1.5">
          <label className="label-style-4">Connector</label>
          <input
            value={accessory.ConnName}
            disabled
            className={disabledInputClass}
          />
        </div>

        {/* Accessory Type - Read Only */}
        <div className="space-y-1.5">
          <label className="label-style-4">Type</label>
          <input
            value={accessory.AccessoryType}
            disabled
            className={disabledInputClass}
          />
        </div>

        {/* RefClient - Read Only */}
        <div className="space-y-1.5">
          <label className="label-style-4">Client Reference</label>
          <input
            value={accessory.RefClient}
            className={disabledInputClass}
            disabled
          />
        </div>

        {/* RefDV - Read Only */}
        <div className="space-y-1.5">
          <label className="label-style-4">DV Reference</label>
          <input
            value={accessory.RefDV || ""}
            className={disabledInputClass}
            disabled
          />
        </div>

        {/* CapotAngle */}
        {accessory.CapotAngle && (
          <div className="space-y-1.5">
            <label className="label-style-4">Capot Angle</label>
            <input
              type="number"
              value={formData.CapotAngle}
              onChange={(e) =>
                setField("CapotAngle", parseInt(e.target.value) || 0)
              }
              className={inputClass}
              placeholder="Capot angle"
            />
          </div>
        )}

        {/* ClipColor */}
        {accessory.ClipColor && (
          <div className="space-y-1.5">
            <label className="label-style-4">Clip Color</label>
            <input
              type="text"
              value={formData.ClipColor}
              onChange={(e) => setField("ClipColor", e.target.value)}
              className={inputClass}
              placeholder="Clip color"
            />
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-1.5">
          <label className="label-style-4">Quantity</label>
          <input
            type="number"
            min="0"
            value={formData.Qty}
            onChange={(e) => setField("Qty", parseInt(e.target.value) || 0)}
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Form Action Buttons */}
      <AccessoryFormActions loading={loading} onCancel={onCancel} />
    </form>
  );
};

const inputClass =
  "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all";

const disabledInputClass =
  "w-full bg-slate-700 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none transition-all appearance-none";
