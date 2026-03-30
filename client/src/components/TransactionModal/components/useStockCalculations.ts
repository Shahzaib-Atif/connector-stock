import { useAppSelector } from "@/store/hooks";
import { WireTypes } from "@shared/enums/WireTypes";
import { useEffect, useMemo, useState } from "react";

export default function useStockCalculations(
  targetId: string | number,
  type: "OUT" | "IN",
  itemType: "connector" | "accessory",
) {
  const masterData = useAppSelector((state) => state.masterData.data);
  const [amount, setAmount] = useState(1);
  const [subType, setSubType] = useState<string | undefined>(undefined);

  // Calculate current stock based on targetId and subType
  const currentStock = useMemo(() => {
    if (!masterData) return 0;

    // Check if targetId is an accessory
    if (itemType === "accessory" && typeof targetId === "number") {
      return masterData.accessories?.[targetId]?.Qty || 0;
    }

    // Otherwise it's a connector
    const connector = masterData.connectors?.[targetId];
    if (!connector) return 0;

    if (subType === WireTypes.COM_FIO) return connector.Qty_com_fio || 0;
    if (subType === WireTypes.SEM_FIO) return connector.Qty_sem_fio || 0;
    return connector.Qty || 0;
  }, [masterData, targetId, subType]);

  // If type is OUT, ensure amount doesn't exceed stock
  useEffect(() => {
    if (type === "OUT" && amount > currentStock) {
      setAmount(Math.max(0, currentStock));
    }
  }, [currentStock, type]);

  return { currentStock, amount, subType, setSubType, setAmount };
}
