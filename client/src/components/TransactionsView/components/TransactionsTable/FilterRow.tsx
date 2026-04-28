import { filterStyles } from "@/utils/filterUtils";

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
      <th className="px-2 py-2" />
      <th className="px-2 py-2 align-top">
        <input
          id="transaction-itemid-filter"
          type="text"
          value={itemIdQuery}
          onChange={(e) => onSearchItemIdChange(e.target.value)}
          autoComplete="off"
          placeholder="All"
          className={filterStyles.input}
        />
      </th>
      <th className="px-2 py-2 align-top">
        <select
          id="transaction-type-filter"
          value={transactionType}
          onChange={(e) =>
            onTransactionTypeChange(e.target.value as "all" | "IN" | "OUT")
          }
          className={filterStyles.select}
        >
          <option value="all">All</option>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select>
      </th>
      <th className="px-2 py-2 align-top">
        <select
          id="transaction-itemtype-filter"
          value={itemType}
          onChange={(e) =>
            onItemTypeChange(
              e.target.value as "all" | "connector" | "accessory",
            )
          }
          className={filterStyles.select}
        >
          <option value="all">All</option>
          <option value="connector">Connector</option>
          <option value="accessory">Accessory</option>
        </select>
      </th>
      <th className="px-2 py-2" />
      <th className="px-2 py-2" />
      <th className="px-2 py-2" />
      <th className="px-2 py-2" />
      <th className="px-2 py-2" />
      <th className="px-2 py-2" />
      <th className="px-2 py-2" />
    </tr>
  );
}

export default FilterRow;
