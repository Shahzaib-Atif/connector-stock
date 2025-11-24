import { useState } from "react";
import { Department } from "../types";
import { performTransaction } from "../services/transactionService";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateStock } from "../store/stockSlice";

export const useTransactionFlow = () => {
  const dispatch = useAppDispatch();

  const { masterData } = useAppSelector((state) => state.stock);

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

  const handleSubmit = (amount: number, department?: Department) => {
    if (!targetId || !masterData) return;

    const delta = txType === "IN" ? amount : -amount;
    const result = performTransaction(targetId, delta, masterData, department);

    dispatch(
      updateStock({
        connectorId: targetId,
        amount: result.accessory
          ? result.accessory.stock
          : result.connector?.stock || 0,
        transaction: result.transaction,
      })
    );

    closeTransaction();
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
