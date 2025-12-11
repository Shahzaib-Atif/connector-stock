import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { DetailHeader } from "../common/DetailHeader";
import { TransactionsTable } from "./components/TransactionsTable";
import { FilterBar } from "./components/FilterBar";
import { Pagination } from "./components/Pagination";
import { UseTransactionsFilter } from "@/hooks/useTransactionsFilters";

export const TransactionsView: React.FC = () => {
  const navigate = useNavigate();
  const transactions = useAppSelector((state) => state.txData.transactions);

  const {
    filteredTransactions,
    itemType,
    transactionType,
    setItemType,
    setTransactionType,
  } = UseTransactionsFilter(transactions);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
    <div className="min-h-screen h-screen bg-gradient-to-br from-slate-800 to-slate-900 text-slate-200 flex flex-col overflow-hidden">
      <DetailHeader
        label="Transactions"
        title="Transaction History"
        onBack={() => navigate("/")}
      />

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full p-4 flex flex-col gap-4">
          <FilterBar
            transactionType={transactionType}
            itemType={itemType}
            onTransactionTypeChange={handleTransactionTypeChange}
            onItemTypeChange={handleItemTypeChange}
          />

          <div className="flex-1 min-h-0">
            <TransactionsTable transactions={paginatedTransactions} />
          </div>

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
    </div>
  );
};
