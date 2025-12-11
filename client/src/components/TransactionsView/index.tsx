import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { DetailHeader } from "../common/DetailHeader";
import { TransactionsTable } from "./components/TransactionsTable";
import { FilterBar } from "./components/FilterBar";
import { Pagination } from "./components/Pagination";
import { UseTransactionsFilter } from "@/hooks/useTransactionsFilters";
import { usePagination } from "@/hooks/usePagination";
import Spinner from "../common/Spinner";

export const TransactionsView: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, loading } = useAppSelector((state) => state.txData);

  const {
    filteredTransactions,
    itemType,
    transactionType,
    setItemType,
    setTransactionType,
  } = UseTransactionsFilter(transactions);

  const {
    paginatedItems: paginatedTransactions,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setCurrentPage,
    setItemsPerPage,
    resetPage,
  } = usePagination({ items: filteredTransactions });

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

  // Show spinner only when loading
  if (loading && transactions.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="table-view-wrapper">
      <DetailHeader
        label="Transactions"
        title="Transaction History"
        onBack={() => navigate("/")}
      />

      <div id="transactions-content" className="table-view-content">
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
