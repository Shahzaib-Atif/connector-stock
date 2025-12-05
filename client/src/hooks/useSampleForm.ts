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
};

const initialFormData: SampleFormData = {
  Cliente: "",
  Projeto: "",
  EncDivmac: "",
  Ref_Descricao: "",
  Ref_Fornecedor: "",
  Amostra: "",
  Data_do_pedido: "",
  Data_recepcao: "",
  Entregue_a: "",
  N_Envio: "",
  Quantidade: "",
  Observacoes: "",
  NumORC: "",
  CreatedBy: "",
  ActualUser: "",
};

export function useSampleForm(sample: Sample | null) {
  const [formData, setFormData] = useState<SampleFormData>(initialFormData);

  useEffect(() => {
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
      });
    } else {
      setFormData(initialFormData);
    }
  }, [sample]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const reset = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  return { formData, handleChange, reset };
}
