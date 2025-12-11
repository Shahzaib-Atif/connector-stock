import { useAppSelector } from "@/store/hooks";
import { Transaction } from "@/types";
import { useState, useMemo, useCallback } from "react";

export function UseTransactionsFilter(transactions: Transaction[]) {
  const [transactionType, setTransactionType] = useState<"all" | "IN" | "OUT">(
    "all"
  );
  const [itemType, setItemType] = useState<"all" | "connector" | "accessory">(
    "all"
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesTransactionType =
        transactionType === "all" || tx.transactionType === transactionType;
      const matchesItemType = itemType === "all" || tx.itemType === itemType;
      return matchesTransactionType && matchesItemType;
    });
  }, [transactions, transactionType, itemType]);

  return {
    filteredTransactions,
    itemType,
    transactionType,
    setItemType,
    setTransactionType,
  };
}
