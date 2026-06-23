import React, { FormEvent } from "react";
import { useConnectorCreateForm } from "./components/useConnectorCreateForm";
import { CreateFormDimensions } from "./components/CreateFormDimensions";
import { CreateFormQuantities } from "./components/CreateFormQuantities";
import CreateFormDetails from "./components/CreateFormDetails";
import CreateFormVias from "./components/CreateFormVias";
import CreateFormMain from "./components/CreateFormMain";
import FormActionBtns from "./components/FormActionBtns";

interface Props {
  onCancel: () => void;
  onSave: () => void;
}

export const ConnectorCreateForm: React.FC<Props> = ({ onCancel, onSave }) => {
  const {
    formData,
    loading,
    error,
    setQtyField,
    setField,
    setDimensionsField,
    handleSubmit,
  } = useConnectorCreateForm(onSave);

  const isOlhalType = formData.ConnType?.toLowerCase() === "olhal";
  const codivmac = formData.PosId
    ? formData.PosId + formData.Cor + formData.Vias
    : "";

  return (
    <form
      onSubmit={(e: FormEvent) => handleSubmit(e, codivmac)}
      className="p-6 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CreateFormMain
          codivmac={codivmac}
          posId={formData.PosId}
          color={formData.Cor}
          connType={formData.ConnType}
          setField={setField}
        />

        <CreateFormVias
          actualViaCount={formData.ActualViaCount}
          setField={setField}
          vias={formData.Vias}
        />

        <CreateFormDetails
          fabricante={formData.Fabricante}
          family={formData.Family}
          refabricante={formData.Refabricante}
          setField={setField}
        />

        {/* Quantities */}
        <CreateFormQuantities
          qtyComFio={formData.Qty_com_fio}
          qtySemFio={formData.Qty_sem_fio}
          setQtyField={setQtyField}
        />

        {/* Dimensions (only for "olhal" type) */}
        {isOlhalType && (
          <CreateFormDimensions
            dimensions={formData.dimensions}
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
      <FormActionBtns loading={loading} onCancel={onCancel} />
    </form>
  );
};
