import React from "react";
import FilterRow from "./FilterRow";
import { StickyHeaderCell } from "@/components/common/TableFilters";

interface TableHeaderProps {
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

function TableHeader({
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
}: TableHeaderProps) {
  return (
    <thead>
      <tr className="table-header">
        <StickyHeaderCell className="w-12">No.</StickyHeaderCell>
        <StickyHeaderCell className="min-w-60">Item ID</StickyHeaderCell>
        <StickyHeaderCell className="min-w-32">Type</StickyHeaderCell>
        <StickyHeaderCell className="min-w-36">Item Type</StickyHeaderCell>
        <StickyHeaderCell className="min-w-36">Department</StickyHeaderCell>
        <StickyHeaderCell className="min-w-36">Amount</StickyHeaderCell>
        <StickyHeaderCell className="min-w-36">Sender</StickyHeaderCell>
        <StickyHeaderCell className="min-w-36">Encomenda</StickyHeaderCell>
        <StickyHeaderCell className="min-w-60">Notes</StickyHeaderCell>
        <StickyHeaderCell className="min-w-32">Wires</StickyHeaderCell>
        <StickyHeaderCell className="min-w-32">Date</StickyHeaderCell>
      </tr>
      {showFilters && (
        <FilterRow
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
      )}
    </thead>
  );
}

export default TableHeader;
