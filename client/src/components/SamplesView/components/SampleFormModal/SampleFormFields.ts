import { SampleFormData } from "@/hooks/useSampleForm";

// Field configuration for the form
export const FORM_FIELDS: {
  name: keyof SampleFormData;
  label: string;
  placeholder: string;
  disabledOnEdit?: boolean;
  type?: "text" | "textarea";
  fullWidth?: boolean;
}[] = [
  { name: "Cliente", label: "Cliente", placeholder: "Client name" },
  { name: "Projeto", label: "Projeto", placeholder: "Project name" },
  { name: "EncDivmac", label: "EncDivmac", placeholder: "EncDivmac" },
  { name: "NumORC", label: "NumORC", placeholder: "ORC Number" },
  {
    name: "Ref_Descricao",
    label: "Ref. Descrição",
    placeholder: "Reference description",
  },
  {
    name: "Ref_Fornecedor",
    label: "Ref. Fornecedor",
    placeholder: "Supplier reference",
  },
  { name: "Amostra", label: "Amostra", placeholder: "Sample code" },
  { name: "Quantidade", label: "Quantidade", placeholder: "Quantity" },
  {
    name: "Data_do_pedido",
    label: "Data do Pedido",
    placeholder: "Request date",
  },
  {
    name: "Data_recepcao",
    label: "Data Receção",
    placeholder: "Reception date",
  },
  { name: "Entregue_a", label: "Entregue A", placeholder: "Delivered to" },
  { name: "N_Envio", label: "N. Envio", placeholder: "Shipping number" },
  {
    name: "CreatedBy",
    label: "Created By",
    placeholder: "Creator",
    disabledOnEdit: true,
  },
  { name: "ActualUser", label: "Actual User", placeholder: "Current user" },
  {
    name: "Observacoes",
    label: "Observações",
    placeholder: "Notes and observations",
    type: "textarea",
    fullWidth: true,
  },
];
