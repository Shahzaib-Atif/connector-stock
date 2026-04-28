import React from "react";
import FilterRow from "./FilterRow";

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
        <th className="table-header-cell w-12">No.</th>
        <th className="table-header-cell min-w-60">Item ID</th>
        <th className="table-header-cell min-w-32">Type</th>
        <th className="table-header-cell min-w-36">Item Type</th>
        <th className="table-header-cell min-w-36">Department</th>
        <th className="table-header-cell min-w-36">Amount</th>
        <th className="table-header-cell min-w-36">Sender</th>
        <th className="table-header-cell min-w-36">Encomenda</th>
        <th className="table-header-cell min-w-60">Notes</th>
        <th className="table-header-cell min-w-32">Wires</th>
        <th className="table-header-cell min-w-32">Date</th>
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
