import {
  ClearableTextFilter,
  SelectFilter,
  StickyFilterCell,
  StickySpacerCell,
} from "@/components/common/TableFilters";

interface Props {
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

function FilterRow({
  transactionType,
  itemType,
  itemIdQuery,
  onTransactionTypeChange,
  onItemTypeChange,
  onSearchItemIdChange,
  // department,
  // sender,
  // onDepartmentChange,
  // onSenderChange,
}: Props) {
  return (
    <tr id="transactions-filter-row" className="bg-slate-900/50">
      <StickySpacerCell />
      <StickyFilterCell>
        <ClearableTextFilter
          id="transaction-itemid-filter"
          value={itemIdQuery}
          onChange={onSearchItemIdChange}
          autoComplete="off"
        />
      </StickyFilterCell>
      <StickyFilterCell>
        <SelectFilter
          id="transaction-type-filter"
          value={transactionType}
          onChange={(value) =>
            onTransactionTypeChange(value as "all" | "IN" | "OUT")
          }
          options={["IN", "OUT"]}
        />
      </StickyFilterCell>
      <StickyFilterCell>
        <SelectFilter
          id="transaction-itemtype-filter"
          value={itemType}
          onChange={(value) =>
            onItemTypeChange(value as "all" | "connector" | "accessory")
          }
          options={["connector", "accessory"]}
        />
      </StickyFilterCell>
      <StickySpacerCell />
      <StickySpacerCell />
      <StickySpacerCell />
      <StickySpacerCell />
      <StickySpacerCell />
      <StickySpacerCell />
      <StickySpacerCell />
      <StickySpacerCell />
    </tr>
  );
}

export default FilterRow;
