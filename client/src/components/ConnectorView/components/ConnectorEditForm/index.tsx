import React from "react";
import { useConnectorEditForm } from "./useConnectorEditForm";
import ConnectorFormActions from "./ConnectorFormActions";
import { Connector } from "@/utils/types";
import { useAppSelector } from "@/store/hooks";

interface Props {
  connector: Connector;
  onCancel: () => void;
  onSave: () => void;
}

export const ConnectorEditForm: React.FC<Props> = ({
  connector,
  onCancel,
  onSave,
}) => {
  const masterData = useAppSelector((state) => state.masterData.data);
  const { formData, loading, error, setQtyField, setField, handleSubmit } =
    useConnectorEditForm(connector, onSave);
  const isActualViasEnabled = connector?.details?.ActualViaCount;

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
          {connector.id}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Color */}
        <div className="space-y-1.5">
          <label className={labelClass}>Color</label>
          <input
            value={formData.Cor}
            disabled
            className={disabledInputClass}
          ></input>
        </div>

        {/* Vias */}
        <div className="space-y-1.5">
          <label className={labelClass}>Vias</label>
          <input
            value={formData.Vias}
            disabled
            className={disabledInputClass}
          ></input>
        </div>

        {/* Type Dropdown */}
        <div className="space-y-1.5">
          <label className={labelClass}>Type</label>
          <select
            value={formData.ConnType}
            onChange={(e) => setField("ConnType", e.target.value)}
            className={inputClass + " appearance-none cursor-pointer"}
          >
            {masterData?.connectorTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Actual Via Count */}
        <div className="space-y-1.5">
          {" "}
          <label className={labelClass}>Actual Vias Count</label>
          <input
            disabled={!isActualViasEnabled}
            type="number"
            value={
              isActualViasEnabled ? formData.ActualViaCount : connector.viasName
            }
            onChange={(e) =>
              setField("ActualViaCount", parseInt(e.target.value))
            }
            className={isActualViasEnabled ? inputClass : disabledInputClass}
          />
        </div>

        {/* Family Input */}
        <div className="space-y-1.5">
          <label className={labelClass}>Family</label>
          <input
            type="number"
            value={formData.Family}
            onChange={(e) => setField("Family", parseInt(e.target.value) || 0)}
            className={inputClass}
          />
        </div>

        {/* Fabricante dropdown */}
        <div className="space-y-1.5">
          <label className={labelClass}>Fabricante</label>
          <select
            value={formData.Fabricante}
            onChange={(e) => setField("Fabricante", e.target.value)}
            className={inputClass + " appearance-none cursor-pointer"}
          >
            <option value="">unknown</option>
            {masterData?.fabricantes.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Breakdown Quantities */}
        <div className="space-y-1.5">
          <label className={labelClass}>With Wires</label>
          <input
            type="number"
            min="0"
            value={formData.Qty_com_fio}
            onChange={(e) =>
              setQtyField("Qty_com_fio", parseInt(e.target.value) || 0)
            }
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>No Wires</label>
          <input
            type="number"
            min="0"
            value={formData.Qty_sem_fio}
            onChange={(e) =>
              setQtyField("Qty_sem_fio", parseInt(e.target.value) || 0)
            }
            className={inputClass}
          />
        </div>

        {/* Total Quantity Input (Read-only as it sums others) */}
        <div className="space-y-1.5">
          <label className={labelClass}>Total Quantity</label>
          <input
            type="number"
            value={formData.Qty}
            disabled
            className={disabledInputClass}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Form Action Buttons */}
      <ConnectorFormActions loading={loading} onCancel={onCancel} />
    </form>
  );
};

const labelClass = "text-xs font-semibold text-slate-400 uppercase ml-1";

const inputClass =
  "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all";

const disabledInputClass =
  "w-full bg-slate-700 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none transition-all appearance-none";
