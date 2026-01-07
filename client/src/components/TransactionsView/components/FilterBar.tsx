import { Department } from "@/utils/types/types";
import React from "react";

interface Props {
  transactionType: "all" | "IN" | "OUT";
  itemType: "all" | "connector" | "accessory";
  onTransactionTypeChange: (type: "all" | "IN" | "OUT") => void;
  onItemTypeChange: (type: "all" | "connector" | "accessory") => void;
  itemIdQuery: string;
  onSearchItemIdChange: (value: string) => void;
  department: string;
  onDepartmentChange: (value: string) => void;
}

export const FilterBar: React.FC<Props> = ({
  transactionType,
  itemType,
  onTransactionTypeChange,
  onItemTypeChange,
  itemIdQuery,
  onSearchItemIdChange,
  department,
  onDepartmentChange,
}) => {
  const labelStyle = "block text-sm font-semibold text-slate-300 mb-2";
  const selectStyle =
    "w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="grid grid-cols-2 lg:flex gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
      {/* Search Item ID */}
      <div className="w-full sm:w-64">
        <label htmlFor="ItemID" className={labelStyle}>
          Search Item ID
        </label>
        <input
          id="ItemID"
          type="text"
          value={itemIdQuery}
          onChange={(e) => onSearchItemIdChange(e.target.value)}
          autoComplete="off"
          placeholder="Enter item ID"
          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Transaction Type Filter */}
      <div className="w-full sm:w-64">
        <label htmlFor="TransactionType" className={labelStyle}>
          Transaction Type
        </label>
        <select
          id="TransactionType"
          value={transactionType}
          onChange={(e) =>
            onTransactionTypeChange(e.target.value as "all" | "IN" | "OUT")
          }
          className={selectStyle}
        >
          <option value="all">All</option>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select>
      </div>

      {/* Item Type Filter */}
      <div className="w-full sm:w-64">
        <label htmlFor="ItemType" className={labelStyle}>
          Item Type
        </label>
        <select
          id="ItemType"
          value={itemType}
          onChange={(e) =>
            onItemTypeChange(
              e.target.value as "all" | "connector" | "accessory"
            )
          }
          className={selectStyle}
        >
          <option value="all">All</option>
          <option value="connector">Connector</option>
          <option value="accessory">Accessory</option>
        </select>
      </div>

      {/* Department Filter */}
      <div className="w-full sm:w-64">
        <label htmlFor="Department" className={labelStyle}>
          Department
        </label>
        <select
          id="Department"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className={selectStyle}
        >
          <option value="all">All</option>
          {Object.values(Department).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
