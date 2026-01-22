import { PaginatedData } from "@/utils/types/shared";
import React from "react";

export const Pagination: React.FC<
  Omit<PaginatedData, "paginatedItems" | "resetPage">
> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  setCurrentPage: onPageChange,
  setItemsPerPage: onItemsPerPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      id="pagination"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 md:p-4 bg-slate-800/50 rounded-xl border border-slate-700"
    >
      {/* Items per page selector */}
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <span>Show</span>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span>per page</span>
      </div>

      {/* Item count display */}
      <div className="text-sm text-slate-400 hidden md:block">
        Showing {startItem}-{endItem} of {totalItems} items
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={buttonClass(false, currentPage === 1)}
        >
          «
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={buttonClass(false, currentPage === 1)}
        >
          ‹
        </button>

        <span className="px-3 py-1.5 text-sm text-slate-300">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={buttonClass(false, currentPage === totalPages)}
        >
          ›
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={buttonClass(false, currentPage === totalPages)}
        >
          »
        </button>
      </div>
    </div>
  );
};

const buttonClass = (isActive: boolean, isDisabled: boolean) =>
  `px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
    isDisabled
      ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
      : isActive
        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
  }`;
