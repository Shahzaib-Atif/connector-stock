import { CreateSamplesDto, SamplesDto } from "@shared/dto/SamplesDto";
import { useState, useEffect, useCallback } from "react";

const initialFormData: CreateSamplesDto = {
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
  Quantidade: "0",
  Observacoes: "",
  NumORC: "",
  CreatedBy: "",
  ActualUser: "",
  qty_com_fio: 0,
  qty_sem_fio: 0,
};

export function useSampleForm(
  sample: SamplesDto | null,
  initialData?: Partial<CreateSamplesDto>,
) {
  const [formData, setFormData] = useState<CreateSamplesDto>(initialFormData);
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<number[]>(
    [],
  );

  useEffect(() => {
    // If editing an existing sample, populate fields
    if (sample) {
      setFormData({
        ...sample,
        qty_com_fio: sample.qty_com_fio ?? 0,
        qty_sem_fio: sample.qty_sem_fio ?? 0,
      });
    } else if (initialData) {
      // If creating new with prefilled data from wizard, merge with initial
      setFormData((prev) => ({ ...prev, ...initialData }));
    } else {
      // If creating new, reset to initial
      setFormData(initialFormData);
    }
  }, [sample, initialData]);

  // Handle auto-calculation of total quantity
  useEffect(() => {
    const total = (formData.qty_com_fio || 0) + (formData.qty_sem_fio || 0);
    if (total.toString() !== formData.Quantidade) {
      setFormData((prev) => ({ ...prev, Quantidade: total.toString() }));
    }
  }, [formData.qty_com_fio, formData.qty_sem_fio]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value, type } = e.target;

      let parsedValue: string | number | boolean = value;
      if (type === "checkbox" && "checked" in e.target) {
        parsedValue = (e.target as HTMLInputElement).checked;
      } else if (type === "number") {
        parsedValue = value === "" ? 0 : parseInt(value, 10);
      }

      setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    },
    [],
  );

  const reset = useCallback(() => {
    setFormData(initialFormData);
    setSelectedAccessoryIds([]);
  }, []);

  return {
    formData,
    handleChange,
    reset,
    selectedAccessoryIds,
    setSelectedAccessoryIds,
  };
}
