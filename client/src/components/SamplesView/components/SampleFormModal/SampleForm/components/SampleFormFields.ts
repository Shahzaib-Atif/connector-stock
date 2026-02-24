import { FORM_FIELDS_Type } from "./FormFieldType";

export const inputClass =
  "w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent accent-blue-500";
export const labelClass = "block text-sm font-medium text-slate-300 mb-1";

// Field configuration for the form
export const FORM_FIELDS: FORM_FIELDS_Type[] = [
  {
    name: "Cliente",
    label: "Cliente",
    placeholder: "Client name",
    type: "autocomplete",
    required: true,
  },
  {
    name: "Projeto",
    label: "Projeto",
    placeholder: "Project name",
    type: "autocomplete",
  },
  {
    name: "EncDivmac",
    label: "EncDivmac",
    placeholder: "EncDivmac",
    // required: true,
  },
  {
    name: "Ref_Descricao",
    label: "Ref. Descrição",
    placeholder: "Reference description",
    required: true,
  },
  {
    name: "Ref_Fornecedor",
    label: "Ref. Fornecedor",
    placeholder: "Supplier reference",
  },
  {
    name: "Amostra",
    label: "Amostra",
    placeholder: "Sample code",
    type: "autocomplete",
    required: true,
  },
  {
    name: "qty_com_fio",
    label: "Quantidade Com Fio",
    placeholder: "Qty with wire",
    type: "number",
  },
  {
    name: "qty_sem_fio",
    label: "Quantidade Sem Fio",
    placeholder: "Qty without wire",
    type: "number",
  },
  {
    name: "Quantidade",
    label: "Quantidade Total",
    placeholder: "Total Quantity",
    type: "number",
    disabledOnEdit: true,
    disabled: true,
  },
  { name: "NumORC", label: "NumORC", placeholder: "ORC Number" },
  {
    name: "Data_do_pedido",
    label: "Data do Pedido",
    placeholder: "Request date",
    type: "date",
  },
  {
    name: "Data_recepcao",
    label: "Data Receção",
    placeholder: "Reception date",
    type: "date",
  },
  {
    name: "Entregue_a",
    label: "Entregue A",
    placeholder: "Delivered to",
    type: "select",
    options: ["vivianni.azevedo", "joana.conceicao", "anashia.nazim"],
  },
  { name: "N_Envio", label: "N. Envio", placeholder: "Shipping number" },
];
