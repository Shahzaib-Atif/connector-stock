import React, { useState } from "react";
import { Save, X, Loader2 } from "lucide-react";
import { Connector, MasterData } from "../../../types";
import { updateConnectorApi } from "../../../services/connectorService";
import { useAppDispatch } from "../../../store/hooks";
import { initMasterData } from "../../../store/slices/masterDataSlice";

interface Props {
  connector: Connector;
  masterData: MasterData;
  onCancel: () => void;
  onSave: () => void;
}

export const ConnectorEditForm: React.FC<Props> = ({
  connector,
  masterData,
  onCancel,
  onSave,
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    Cor: connector.colorCode,
    Vias: connector.viasCode,
    ConnType: connector.type,
    Fabricante: connector.fabricante === "--" ? "" : connector.fabricante,
    Family: connector.family || 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateConnectorApi(connector.id, formData);
      await dispatch(initMasterData());
      onSave();
    } catch (err: any) {
      setError(err.message || "Failed to update connector");
      setLoading(false);
    }
  };

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
        {/* Color Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase ml-1">
            Color
          </label>
          <input
            value={formData.Cor}
            disabled
            onChange={(e) => setFormData({ ...formData, Cor: e.target.value })}
            className="w-full bg-slate-700 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none transition-all appearance-none"
          ></input>
        </div>

        {/* Vias Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase ml-1">
            Vias
          </label>
          <input
            value={formData.Vias}
            onChange={(e) => setFormData({ ...formData, Vias: e.target.value })}
            disabled
            className="w-full bg-slate-700 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none transition-all appearance-none"
          ></input>
        </div>

        {/* Type Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase ml-1">
            Type
          </label>
          <select
            value={formData.ConnType}
            onChange={(e) =>
              setFormData({ ...formData, ConnType: e.target.value })
            }
            className={selectClass}
          >
            {masterData.connectorTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Family Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase ml-1">
            Family
          </label>
          <select
            value={formData.Family}
            onChange={(e) =>
              setFormData({ ...formData, Family: parseInt(e.target.value) })
            }
            className={selectClass}
          >
            {[1, 2, 3, 4, 5].map((f) => (
              <option key={f} value={f}>
                Family {f}
              </option>
            ))}
          </select>
        </div>

        {/* Fabricante dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase ml-1">
            Fabricante
          </label>
          <select
            value={formData.Fabricante}
            onChange={(e) =>
              setFormData({ ...formData, Fabricante: e.target.value })
            }
            className={selectClass}
          >
            {masterData.fabricantes.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const selectClass =
  "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none cursor-pointer";
