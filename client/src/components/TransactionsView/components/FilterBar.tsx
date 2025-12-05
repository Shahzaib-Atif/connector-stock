import React from "react";

interface FilterBarProps {
  transactionType: "all" | "IN" | "OUT";
  itemType: "all" | "connector" | "accessory";
  onTransactionTypeChange: (type: "all" | "IN" | "OUT") => void;
  onItemTypeChange: (type: "all" | "connector" | "accessory") => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  transactionType,
  itemType,
  onTransactionTypeChange,
  onItemTypeChange,
}) => {
  const filterButtonClass = (isActive: boolean) =>
    `px-4 py-2 rounded-lg font-medium text-sm transition-all ${
      isActive
        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
    }`;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
      {/* Transaction Type Filter */}
      <div className="flex-1">
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Transaction Type
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onTransactionTypeChange("all")}
            className={filterButtonClass(transactionType === "all")}
          >
            All
          </button>
          <button
            onClick={() => onTransactionTypeChange("IN")}
            className={filterButtonClass(transactionType === "IN")}
          >
            IN
          </button>
          <button
            onClick={() => onTransactionTypeChange("OUT")}
            className={filterButtonClass(transactionType === "OUT")}
          >
            OUT
          </button>
        </div>
      </div>

      {/* Item Type Filter */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Item Type
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onItemTypeChange("all")}
            className={filterButtonClass(itemType === "all")}
          >
            All
          </button>
          <button
            onClick={() => onItemTypeChange("connector")}
            className={filterButtonClass(itemType === "connector")}
          >
            Connector
          </button>
          <button
            onClick={() => onItemTypeChange("accessory")}
            className={filterButtonClass(itemType === "accessory")}
          >
            Accessory
          </button>
        </div>
      </div>
    </div>
  );
};
