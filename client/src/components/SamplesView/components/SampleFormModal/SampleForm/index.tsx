import React from "react";
import { useSampleForm } from "@/hooks/useSampleForm";
import { FormField } from "./components/FormField";
import { labelClass, inputClass } from "./components/SampleFormFields";
import { useAssociatedAccessories } from "@/hooks/useAssociatedAccessories";
import AccessoryChecklist from "@/components/TransactionModal/components/AccessoryChecklist";
import useSampleOptions from "./components/useSampleOptions";
import { useConnectorId } from "./components/useConnectorId";
import ErrorBanner from "./components/ErrorBanner";
import ActionButtons from "./components/ActionButtons";
import { CreateSamplesDto, SamplesDto } from "@shared/dto/SamplesDto";
import { useSampleFormSubmit } from "./components/useSampleFormSubmit ";
import { LineStatusContext } from "@/utils/types/divDesk";
import ConfirmConnectorRename from "./components/ConfirmConnectorRename";

interface Props {
  sample: SamplesDto | null;
  onClose: () => void;
  onSuccess: () => void;
  isEditing: boolean;
  initialData?: Partial<CreateSamplesDto>;
  lineStatusContext?: LineStatusContext;
}

export const SampleForm: React.FC<Props> = ({
  sample,
  onClose,
  onSuccess,
  isEditing,
  initialData,
  lineStatusContext,
}) => {
  const {
    formData,
    handleChange,
    selectedAccessoryIds,
    setSelectedAccessoryIds,
  } = useSampleForm(sample, initialData);

  const connectorId = useConnectorId(formData?.Amostra ?? ""); // get connector ID from Amostra
  const { associatedAccessories } = useAssociatedAccessories(connectorId); // fetch associated accessories
  const { getOptions } = useSampleOptions(); // autocomplete options
  const {
    handleSubmit,
    formError,
    loading,
    pendingConnectorUpdate,
    handleUpdateConnectorName,
    handleSkipConnectorUpdate,
  } = useSampleFormSubmit({
    formData,
    isEditing,
    sample,
    selectedAccessoryIds,
    onSuccess,
    lineStatusContext,
  });

  if (pendingConnectorUpdate) {
    return (
      <ConfirmConnectorRename
        handleSkipConnectorUpdate={handleSkipConnectorUpdate}
        handleUpdateConnectorName={handleUpdateConnectorName}
        loading={loading}
        pendingConnectorUpdate={pendingConnectorUpdate}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <ErrorBanner message={formError || ""} />

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name="Cliente"
          label="Cliente"
          value={formData.Cliente?.trim() ?? ""}
          onChange={handleChange}
          placeholder="Client name"
          type="autocomplete"
          required
          options={getOptions("Cliente")}
        />
        <FormField
          name="Projeto"
          label="Projeto"
          value={formData.Projeto?.trim() ?? ""}
          onChange={handleChange}
          placeholder="Project name"
          type="autocomplete"
          options={getOptions("Projeto")}
        />
        <FormField
          name="EncDivmac"
          label="EncDivmac"
          value={formData.EncDivmac?.trim() ?? ""}
          onChange={handleChange}
          placeholder="EncDivmac"
        />
        <FormField
          name="Ref_Descricao"
          label="Ref. Descricao"
          value={formData.Ref_Descricao?.trim() ?? ""}
          onChange={handleChange}
          placeholder="Reference description"
          required
        />
        <FormField
          name="Ref_Fornecedor"
          label="Ref. Fornecedor"
          value={formData.Ref_Fornecedor?.trim() ?? ""}
          onChange={handleChange}
          placeholder="Supplier reference"
        />
        <FormField
          name="Amostra"
          label="Amostra"
          value={formData.Amostra?.trim() ?? ""}
          onChange={handleChange}
          placeholder="Sample code"
          type="autocomplete"
          required
          options={getOptions("Amostra")}
        />
        <FormField
          name="qty_com_fio"
          label="Quantidade Com Fio"
          value={formData.qty_com_fio ?? 0}
          onChange={handleChange}
          placeholder="Qty with wire"
          type="number"
        />
        <FormField
          name="qty_sem_fio"
          label="Quantidade Sem Fio"
          value={formData.qty_sem_fio ?? 0}
          onChange={handleChange}
          placeholder="Qty without wire"
          type="number"
        />
        <FormField
          name="Quantidade"
          label="Quantidade Total"
          value={formData.Quantidade?.trim() ?? ""}
          onChange={handleChange}
          placeholder="Total Quantity"
          type="number"
          disabled={true}
        />
        <FormField
          name="NumORC"
          label="NumORC"
          value={formData.NumORC?.trim() ?? ""}
          onChange={handleChange}
          placeholder="ORC Number"
        />
        <FormField
          name="Data_do_pedido"
          label="Data do Pedido"
          value={formData.Data_do_pedido?.trim() ?? ""}
          onChange={handleChange}
          placeholder="Request date"
          type="date"
        />
        <FormField
          name="Data_recepcao"
          label="Data Rececao"
          value={formData.Data_recepcao?.trim() ?? ""}
          onChange={handleChange}
          placeholder="Reception date"
          type="date"
        />
        <FormField
          name="Entregue_a"
          label="Entregue A"
          value={formData.Entregue_a?.trim() ?? ""}
          onChange={handleChange}
          placeholder="Delivered to"
          type="select"
          options={getOptions("Entregue_a", [
            "vivianni.azevedo",
            "joana.conceicao",
            "anashia.nazim",
          ])}
        />
        <FormField
          name="N_Envio"
          label="N. Envio"
          value={formData.N_Envio?.trim() ?? ""}
          onChange={handleChange}
          placeholder="Shipping number"
        />
      </div>

      {/* observation textarea*/}
      <div className="mt-4">
        <label className={labelClass}>Observações</label>
        <textarea
          name="Observacoes"
          value={formData.Observacoes ?? ""}
          onChange={handleChange}
          rows={2}
          className={inputClass}
          placeholder="Notes and observations"
        />
      </div>

      {/* Associated Accessories Checklist */}
      <div className="mt-6">
        <AccessoryChecklist
          associatedAccessories={associatedAccessories}
          selectedAccessoryIds={selectedAccessoryIds}
          setSelectedAccessoryIds={setSelectedAccessoryIds}
          transactionType="IN"
        />
      </div>

      {/* Action buttons */}
      <ActionButtons
        isEditing={isEditing}
        loading={loading}
        onClose={onClose}
      />
    </form>
  );
};
