import React from "react";
import { Transaction } from "@shared/types/Transaction";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

interface TransactionsTableProps {
  transactions: Transaction[];
  showFilters?: boolean;
  transactionType: "all" | "IN" | "OUT";
  itemType: "all" | "connector" | "accessory";
  itemIdQuery: string;
  department: string;
  sender: string;
  onTransactionTypeChange: (type: "all" | "IN" | "OUT") => void;
  onItemTypeChange: (type: "all" | "connector" | "accessory") => void;
  onSearchItemIdChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onSenderChange: (value: string) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  showFilters = false,
  transactionType,
  itemType,
  itemIdQuery,
  department,
  sender,
  onTransactionTypeChange,
  onItemTypeChange,
  onSearchItemIdChange,
  onDepartmentChange,
  onSenderChange,
}) => {
  return (
    <div id="transactions-table" className="table-container-inner">
      <table className="w-full text-sm">
        <TableHeader
          showFilters={showFilters}
          transactionType={transactionType}
          itemType={itemType}
          itemIdQuery={itemIdQuery}
          department={department}
          sender={sender}
          onTransactionTypeChange={onTransactionTypeChange}
          onItemTypeChange={onItemTypeChange}
          onSearchItemIdChange={onSearchItemIdChange}
          onDepartmentChange={onDepartmentChange}
          onSenderChange={onSenderChange}
        />
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={11} className="table-row-not-found">
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((tx, index) => (
              <TableRow key={tx.ID} tx={tx} index={index} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
