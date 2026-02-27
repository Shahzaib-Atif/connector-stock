import React from "react";
import { useConnectorEditForm } from "./components/useConnectorEditForm";
import ConnectorFormActions from "./components/ConnectorFormActions";
import { Connector } from "@/utils/types";
import { useAppSelector } from "@/store/hooks";
import NumberInputDiv from "@/components/common/NumberInputDiv";
import OlhalDimensions from "./components/OlhalDimensions";
import DisabledDiv from "@/components/common/DisabledDiv";

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
  const {
    formData,
    loading,
    error,
    setQtyField,
    setField,
    setDimensionsField,
    handleSubmit,
  } = useConnectorEditForm(connector, onSave);
  const isActualViasEnabled = connector?.details?.ActualViaCount;
  const isOlhalType =
    formData.ConnType && formData.ConnType.toLowerCase() === "olhal";

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
        <DisabledDiv label="Color" value={formData.Cor} />

        {/* Vias */}
        <DisabledDiv label="Vias" value={formData.Vias} />

        {/* Type Dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="conn-type-select" className="label-style-4">
            Type
          </label>
          <select
            id="conn-type-select"
            value={formData.ConnType}
            onChange={(e) => setField("ConnType", e.target.value)}
            className="input-style-main input-style-enabled appearance-none cursor-pointer"
          >
            {masterData?.connectorTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Actual Via Count */}
        {isActualViasEnabled ? (
          <NumberInputDiv
            label="Actual Vias Count"
            value={formData.ActualViaCount}
            onChange={(e) =>
              setField("ActualViaCount", parseInt(e.target.value))
            }
          />
        ) : (
          <DisabledDiv label="Actual Vias Count" value={connector.viasName} />
        )}

        {/* Family Input */}
        <NumberInputDiv
          label="Family"
          value={formData.Family}
          min={1}
          step={1}
          onChange={(e) => setField("Family", parseInt(e.target.value) || 0)}
        />

        {/* Fabricante dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="fabricante-select" className="label-style-4">
            Fabricante
          </label>
          <select
            id="fabricante-select"
            value={formData.Fabricante}
            onChange={(e) => setField("Fabricante", e.target.value)}
            className="input-style-main input-style-enabled appearance-none cursor-pointer"
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
        <NumberInputDiv
          label="With Wires"
          value={formData.Qty_com_fio}
          min={0}
          step={1}
          onChange={(e) =>
            setQtyField("Qty_com_fio", parseInt(e.target.value) || 0)
          }
        />

        <NumberInputDiv
          label="No Wires"
          value={formData.Qty_sem_fio}
          min={0}
          step={1}
          onChange={(e) =>
            setQtyField("Qty_sem_fio", parseInt(e.target.value) || 0)
          }
        />

        {/* Dimensions (only for \"olhal\" type) */}
        {isOlhalType && (
          <OlhalDimensions
            formData={formData}
            setDimensionsField={setDimensionsField}
          />
        )}
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
