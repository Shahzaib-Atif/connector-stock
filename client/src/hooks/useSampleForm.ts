import { useState, useEffect, useCallback } from "react";
import { Sample } from "@/types";

export type SampleFormData = {
  Cliente: string;
  Projeto: string;
  EncDivmac: string;
  Ref_Descricao: string;
  Ref_Fornecedor: string;
  Amostra: string;
  Data_do_pedido: string;
  Data_recepcao: string;
  Entregue_a: string;
  N_Envio: string;
  Quantidade: string;
  Observacoes: string;
  NumORC: string;
  CreatedBy: string;
  ActualUser: string;
  com_fio: boolean;
};

const initialFormData: SampleFormData = {
  Cliente: "",
  Projeto: "",
  EncDivmac: "",
  Ref_Descricao: "",
  Ref_Fornecedor: "",
  Amostra: "",
  Data_do_pedido: "",
  Data_recepcao: new Date().toISOString().split("T")[0],
  Entregue_a: "",
  N_Envio: "",
  Quantidade: "1",
  Observacoes: "",
  NumORC: "",
  CreatedBy: "",
  ActualUser: "",
  com_fio: false,
};

export function useSampleForm(sample: Sample | null) {
  const [formData, setFormData] = useState<SampleFormData>(initialFormData);

  useEffect(() => {
    // If editing an existing sample, populate fields
    if (sample) {
      setFormData({
        Cliente: sample.Cliente || "",
        Projeto: sample.Projeto || "",
        EncDivmac: sample.EncDivmac || "",
        Ref_Descricao: sample.Ref_Descricao || "",
        Ref_Fornecedor: sample.Ref_Fornecedor || "",
        Amostra: sample.Amostra || "",
        Data_do_pedido: sample.Data_do_pedido || "",
        Data_recepcao: sample.Data_recepcao || "",
        Entregue_a: sample.Entregue_a || "",
        N_Envio: sample.N_Envio || "",
        Quantidade: sample.Quantidade || "",
        Observacoes: sample.Observacoes || "",
        NumORC: sample.NumORC || "",
        CreatedBy: sample.CreatedBy || "",
        ActualUser: sample.ActualUser || "",
        com_fio: sample.com_fio ?? false,
      });
    } else {
      // If creating new, reset to initial
      setFormData(initialFormData);
    }
  }, [sample]);

  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      const parsedValue =
        type === "checkbox" && "checked" in e.target
          ? (e.target as HTMLInputElement).checked
          : value;

      setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    },
    []
  );

  const reset = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  return { formData, handleChange, reset };
}
