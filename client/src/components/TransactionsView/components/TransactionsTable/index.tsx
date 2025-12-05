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
    <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50">
      <table className="w-full text-sm">
        <TableHeader />
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((tx, index) => <TableRow tx={tx} index={index} />)
          )}
        </tbody>
      </table>
    </div>
  );
};
