import React from "react";
import { useAccessoryEditForm } from "../useAccessoryEditForm";
import AccessoryFormActions from "./AccessoryFormActions";
import { Accessory } from "@/utils/types";
import DisabledDiv from "@/components/common/DisabledDiv";
import NumberInputDiv from "@/components/common/NumberInputDiv";

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
        <DisabledDiv label="Connector" value={accessory.ConnName} />

        {/* Accessory Type - Read Only */}
        <DisabledDiv label="Type" value={accessory.AccessoryType} />

        {/* RefClient - Read Only */}
        <DisabledDiv label="Client Reference" value={accessory.RefClient} />

        {/* RefDV - Read Only */}
        <DisabledDiv label="DV Reference" value={accessory.RefDV} />

        {/* CapotAngle */}
        {accessory.CapotAngle && (
          <NumberInputDiv
            label="Capot Angle"
            value={formData.CapotAngle}
            min={0}
            step={45}
            onChange={(e) =>
              setField("CapotAngle", parseInt(e.target.value) || 0)
            }
          />
        )}

        {/* ClipColor */}
        {accessory.ClipColor && (
          <div className="space-y-1.5">
            <label className="label-style-4">Clip Color</label>
            <input
              type="text"
              value={formData.ClipColor}
              onChange={(e) => setField("ClipColor", e.target.value)}
              className="input-style-main input-style-enabled"
              placeholder="Clip color"
            />
          </div>
        )}

        {/* Quantity */}
        <NumberInputDiv
          label="Quantity"
          value={formData.Qty}
          min={0}
          step={1}
          onChange={(e) => setField("Qty", parseInt(e.target.value) || 0)}
        />
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
