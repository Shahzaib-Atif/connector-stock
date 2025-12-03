import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { DetailHeader } from "../common/DetailHeader";
import { TransactionsTable } from "./components/TransactionsTable";
import { FilterBar } from "./components/FilterBar";
import { Pagination } from "./components/Pagination";

export const TransactionsView: React.FC = () => {
  const navigate = useNavigate();
  const transactions = useAppSelector((state) => state.txData.transactions);

  // Filter state
  const [transactionType, setTransactionType] = useState<"all" | "IN" | "OUT">(
    "all"
  );
  const [itemType, setItemType] = useState<"all" | "connector" | "accessory">(
    "all"
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Apply filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesTransactionType =
        transactionType === "all" || tx.transactionType === transactionType;
      const matchesItemType = itemType === "all" || tx.itemType === itemType;
      return matchesTransactionType && matchesItemType;
    });
  }, [transactions, transactionType, itemType]);

  // Apply pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  const handleTransactionTypeChange = (type: "all" | "IN" | "OUT") => {
    setTransactionType(type);
    setCurrentPage(1);
  };

  const handleItemTypeChange = (type: "all" | "connector" | "accessory") => {
    setItemType(type);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 pb-8 text-slate-200">
      <DetailHeader
        label="Transactions"
        title="Transaction History"
        onBack={() => navigate("/")}
      />

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        <FilterBar
          transactionType={transactionType}
          itemType={itemType}
          onTransactionTypeChange={handleTransactionTypeChange}
          onItemTypeChange={handleItemTypeChange}
        />

        <TransactionsTable transactions={paginatedTransactions} />

        {filteredTransactions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredTransactions.length}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>
    </div>
  );
};
