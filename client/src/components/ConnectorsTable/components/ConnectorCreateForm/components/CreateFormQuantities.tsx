import React from "react";
import NumberInputDiv from "@/components/common/NumberInputDiv";

interface Props {
  qtyComFio: number;
  qtySemFio: number;
  setQtyField: (field: "Qty_com_fio" | "Qty_sem_fio", value: number) => void;
}

export const CreateFormQuantities: React.FC<Props> = ({
  qtyComFio,
  qtySemFio,
  setQtyField,
}) => {
  return (
    <>
      <NumberInputDiv
        label="With Wires"
        value={qtyComFio}
        min={0}
        step={1}
        onChange={(e) =>
          setQtyField("Qty_com_fio", parseInt(e.target.value) || 0)
        }
      />

      <NumberInputDiv
        label="No Wires"
        value={qtySemFio}
        min={0}
        step={1}
        onChange={(e) =>
          setQtyField("Qty_sem_fio", parseInt(e.target.value) || 0)
        }
      />
    </>
  );
};
