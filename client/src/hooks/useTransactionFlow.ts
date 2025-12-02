import { useState } from "react";
import { Department } from "../types";
import { performTransaction } from "../services/transactionService";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateStock } from "../store/stockSlice";

export const useTransactionFlow = () => {
  const dispatch = useAppDispatch();

  const { data: masterData } = useAppSelector((state) => state.masterData);

  const [isOpen, setIsOpen] = useState(false);
  const [txType, setTxType] = useState<"IN" | "OUT">("IN");
  const [targetId, setTargetId] = useState<string | undefined>(undefined);

  const openTransaction = (type: "IN" | "OUT", specificTargetId?: string) => {
    setTxType(type);
    setTargetId(specificTargetId);
    setIsOpen(true);
  };

  const closeTransaction = () => {
    setIsOpen(false);
    setTargetId(undefined);
  };

  const handleSubmit = async (amount: number, department?: Department) => {
    if (!targetId || !masterData) return;

    // const currentStock = stockCache[targetId] || 0;
    const currentStock = 0; //  TODO
    const delta = txType === "IN" ? amount : -amount;
    const newStock = Math.max(0, currentStock + delta);

    try {
      const result = await performTransaction(
        targetId,
        delta,
        masterData,
        department
      );

      dispatch(
        updateStock({
          connectorId: targetId,
          amount: newStock,
          transaction: result.transaction,
        })
      );

      closeTransaction();
    } catch (error) {
      console.error("Transaction failed:", error);
      // Optionally handle error state here
    }
  };

  return {
    isOpen,
    txType,
    targetId,
    openTransaction,
    closeTransaction,
    handleSubmit,
  };
};
