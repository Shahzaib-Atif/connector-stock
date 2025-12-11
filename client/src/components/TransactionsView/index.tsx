import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { DetailHeader } from "../common/DetailHeader";
import { TransactionsTable } from "./components/TransactionsTable";
import { FilterBar } from "./components/FilterBar";
import { UseTransactionsFilter } from "@/hooks/useTransactionsFilters";
import { usePagination } from "@/hooks/usePagination";
import Spinner from "../common/Spinner";
import { Pagination } from "../common/Pagination";

export const TransactionsView: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, loading } = useAppSelector((state) => state.txData);

  // filter
  const {
    filteredTransactions,
    itemType,
    transactionType,
    setItemType,
    setTransactionType,
    itemIdQuery,
    setItemIdQuery,
    department,
    setDepartment,
  } = UseTransactionsFilter(transactions);

  // pagination
  const {
    paginatedItems: paginatedTransactions,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({ items: filteredTransactions });

  const handleTransactionTypeChange = (type: "all" | "IN" | "OUT") => {
    setTransactionType(type);
    setCurrentPage(1);
  };

  const handleItemTypeChange = (type: "all" | "connector" | "accessory") => {
    setItemType(type);
    setCurrentPage(1);
  };

  const handleItemIdQueryChange = (query: string) => {
    setItemIdQuery(query);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    setCurrentPage(1);
  };

  // Show spinner only when loading
  if (loading && transactions.length === 0) {
    return <Spinner />;
  }

  return (
    <div id="transactions-page" className="table-view-wrapper">
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
            itemIdQuery={itemIdQuery}
            onSearchItemIdChange={handleItemIdQueryChange}
            department={department}
            onDepartmentChange={handleDepartmentChange}
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
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
