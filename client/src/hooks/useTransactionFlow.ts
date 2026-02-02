import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { performTransactionThunk } from "@/store/slices/transactionsSlice";
import { Department } from "@/utils/types/shared";

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

  const handleSubmit = async (
    amount: number,
    department?: Department,
    associatedItemIds: string[] = [],
    subType?: string
  ) => {
    if (!targetId || !masterData) return;

    const delta = txType === "IN" ? amount : -amount;
    try {
      // Main item transaction
      await dispatch(
        performTransactionThunk({
          itemId: targetId,
          delta,
          department,
          subType,
        })
      );

      // Associated accessories transactions
      if (associatedItemIds.length > 0) {
        await Promise.all(
          associatedItemIds.map((accId) =>
            dispatch(
              performTransactionThunk({
                itemId: accId,
                delta,
                department,
              })
            )
          )
        );
      }

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
