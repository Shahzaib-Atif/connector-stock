import { useState } from "react";
import { Department } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { performTransactionThunk } from "@/store/slices/transactionsSlice";

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

    const delta = txType === "IN" ? amount : -amount;
    try {
      dispatch(
        performTransactionThunk({
          itemId: targetId,
          delta,
          department,
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
