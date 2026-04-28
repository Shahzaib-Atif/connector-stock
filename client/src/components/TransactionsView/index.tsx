import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { DetailHeader } from "../common/DetailHeader";
import { TransactionsTable } from "./components/TransactionsTable";
import { FilterBar } from "./components/FilterBar";
import { useTransactionsFilter } from "@/hooks/useTransactionsFilters";
import { usePagination } from "@/hooks/usePagination";
import Spinner from "../common/Spinner";
import { ROUTES } from "../AppRoutes";
import { Pagination } from "../common/Pagination";
import { Transaction } from "@shared/types/Transaction";
import { useFiltersToggle } from "../ConnectorsTable/ConnectorsTable/useFiltersToggle";

export const TransactionsView: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, loading } = useAppSelector((state) => state.txData);
  const { showFilters, setShowFilters } = useFiltersToggle(
    "transactions_show_filters",
  );

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
    sender,
    setSender,
  } = useTransactionsFilter(transactions);

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

  const handleSenderChange = (value: string) => {
    setSender(value);
    setCurrentPage(1);
  };

  // Show spinner only when loading
  if (loading && transactions.length === 0) {
    return <Spinner />;
  }

  return (
    <div id="transactions-page" className="table-view-wrapper min-h-[600px]">
      <DetailHeader
        label="Transactions"
        title="Transaction History"
        onBack={() => navigate(ROUTES.HOME)}
      />

      <div id="transactions-content" className="table-view-content">
        <div className="table-view-inner-content">
          <FilterBar
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            transactionType={transactionType}
            itemType={itemType}
            onTransactionTypeChange={handleTransactionTypeChange}
            onItemTypeChange={handleItemTypeChange}
            itemIdQuery={itemIdQuery}
            onSearchItemIdChange={handleItemIdQueryChange}
            department={department}
            onDepartmentChange={handleDepartmentChange}
            sender={sender}
            onSenderChange={handleSenderChange}
          />

          <div className="table-container-outer">
            <TransactionsTable
              transactions={paginatedTransactions as Transaction[]}
              showFilters={showFilters}
              transactionType={transactionType}
              itemType={itemType}
              itemIdQuery={itemIdQuery}
              department={department}
              sender={sender}
              onTransactionTypeChange={handleTransactionTypeChange}
              onItemTypeChange={handleItemTypeChange}
              onSearchItemIdChange={handleItemIdQueryChange}
              onDepartmentChange={handleDepartmentChange}
              onSenderChange={handleSenderChange}
            />
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
