import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { performTransactionThunk } from "@/store/slices/transactionsSlice";
import {
  TransactionConfirmPayload,
  TransactionOpenOptions,
} from "@/utils/types/transactionTypes";

export const useTransactionFlow = () => {
  const dispatch = useAppDispatch();

  const { data: masterData } = useAppSelector((state) => state.masterData);

  const [isOpen, setIsOpen] = useState(false);
  const [txType, setTxType] = useState<"IN" | "OUT">("IN");
  const [targetId, setTargetId] = useState<string | number | undefined>(
    undefined,
  );
  const [itemType, setItemType] = useState<"connector" | "accessory">(
    "connector",
  );

  const openTransaction = ({
    transactionType: type,
    itemType,
    targetId: specificTargetId,
  }: TransactionOpenOptions) => {
    setTxType(type);
    setTargetId(specificTargetId);
    setItemType(itemType);
    setIsOpen(true);
  };

  const closeTransaction = () => {
    setIsOpen(false);
    setTargetId(undefined);
  };

  const handleSubmit = async (data: TransactionConfirmPayload) => {
    const {
      amount,
      isConnector,
      associatedItemIds,
      department,
      subType,
      encomenda,
    } = data;
    if (!targetId || !masterData) return;

    const delta = txType === "IN" ? amount : -amount;
    try {
      // Main item transaction
      await dispatch(
        performTransactionThunk({
          itemId: targetId,
          delta,
          isConnector,
          department,
          subType,
          encomenda,
        }),
      );

      // Associated accessories transactions
      if (associatedItemIds.length > 0) {
        await Promise.all(
          associatedItemIds.map((accId) =>
            dispatch(
              performTransactionThunk({
                itemId: accId,
                delta,
                isConnector,
                department,
              }),
            ),
          ),
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
    itemType,
    openTransaction,
    closeTransaction,
    handleSubmit,
  };
};
