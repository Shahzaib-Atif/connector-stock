import React from "react";
import { Transaction } from "@/types";
import { Link } from "react-router-dom";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
}) => {
  return (
    <div id="transactions-table" className="table-container-inner">
      <table className="w-full text-sm">
        <TableHeader />
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={7} className="table-row-not-found">
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
