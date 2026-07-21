import React from "react";
import { useConnectorCreateForm } from "./components/useConnectorCreateForm";
import CreateFormDetails from "./components/CreateFormDetails";
import CreateFormMain from "./components/CreateFormMain";
import FormActionBtns from "./components/FormActionBtns";
import { getCodivmac } from "./components/utils";

interface Props {
  onCancel: () => void;
  onSave: () => void;
  initialData?: {
    PosId: string;
    Cor: string;
    Vias: string;
  };
}

export const ConnectorCreateForm: React.FC<Props> = ({
  onCancel,
  onSave,
  initialData,
}) => {
  const {
    formData,
    loading,
    error,
    setQtyField,
    setField,
    setDimensionsField,
    setDetailsField,
    handleSubmit,
  } = useConnectorCreateForm(onSave, initialData);

  // Generate CODIVMAC based on form data
  const codivmac = getCodivmac(formData);

  return (
    <form onSubmit={(e) => handleSubmit(e, codivmac)} className="p-6 space-y-5">
      <div className="flex gap-6">
        <CreateFormMain
          codivmac={codivmac}
          formData={formData}
          setField={setField}
          setDimensionsField={setDimensionsField}
          setDetailsField={setDetailsField}
        />

        <CreateFormDetails
          formData={formData}
          setDetailsField={setDetailsField}
          setQtyField={setQtyField}
        />
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
