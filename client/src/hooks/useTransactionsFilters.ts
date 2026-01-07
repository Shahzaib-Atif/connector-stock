import { Department, Transaction } from "@/utils/types/types";
import { useState, useMemo } from "react";

export function useTransactionsFilter(transactions: Transaction[]) {
  const [transactionType, setTransactionType] = useState<"all" | "IN" | "OUT">(
    "all"
  );
  const [itemType, setItemType] = useState<"all" | "connector" | "accessory">(
    "all"
  );
  const [itemIdQuery, setItemIdQuery] = useState("");
  const [department, setDepartment] = useState<Department | "all">("all");

  const filteredTransactions = useMemo(() => {
    // Normalize search inputs for case-insensitive matching
    const normalizedQuery = itemIdQuery.trim().toLowerCase();
    const normalizedDepartment = department.toLowerCase();

    // Apply all active filters to transaction list
    return transactions.filter((tx) => {
      const matchesTransactionType =
        transactionType === "all" || tx.transactionType === transactionType;

      const matchesItemType = itemType === "all" || tx.itemType === itemType;

      const matchesItemId =
        !normalizedQuery || tx.itemId.toLowerCase().includes(normalizedQuery);

      const txDepartment = tx.department?.toLowerCase();
      const matchesDepartment =
        normalizedDepartment === "all" || txDepartment === normalizedDepartment;

      return (
        matchesTransactionType &&
        matchesItemType &&
        matchesItemId &&
        matchesDepartment
      );
    });
  }, [transactions, transactionType, itemType, itemIdQuery, department]);

  return {
    filteredTransactions,
    itemType,
    transactionType,
    setItemType,
    setTransactionType,
    itemIdQuery,
    setItemIdQuery,
    department,
    setDepartment,
  };
}
