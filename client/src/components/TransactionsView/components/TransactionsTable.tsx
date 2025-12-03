import React from "react";
import { Transaction } from "@/types";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-800">
            <th className="px-4 py-3 text-left font-semibold text-slate-300">
              No.
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">
              Item ID
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">
              Item Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">
              Amount
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">
              Department
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((tx, index) => (
              <tr
                key={tx.ID}
                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
              >
                <td className="px-4 py-3 text-slate-300 font-mono text-xs">
                  {index}
                </td>
                <td className="px-4 py-3 text-slate-200 font-mono">
                  {tx.itemId}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      tx.transactionType === "IN"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {tx.transactionType}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300 capitalize">
                  {tx.itemType}
                </td>
                <td className="px-4 py-3 text-slate-200 font-semibold">
                  {tx.amount}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {tx.department || "—"}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {formatDate(tx.timestamp)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
