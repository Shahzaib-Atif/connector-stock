import { Transaction } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { Link } from "react-router-dom";

interface Props {
  tx: Transaction;
  index: number;
}
function TableRow({ tx, index }: Props) {
  return (
    <tr key={tx.ID} className="table-row-bg">
      <td className="table-data text-slate-300 font-mono text-xs">{index}</td>
      <td className="table-data">
        <Link
          to={`/${tx.itemType}/${tx.itemId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 font-mono underline decoration-dotted underline-offset-2 transition-colors"
        >
          {tx.itemId}
        </Link>
      </td>
      <td className="table-data">
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
      <td className="table-data capitalize">{tx.itemType}</td>
      <td className="table-data font-semibold">{tx.amount}</td>
      <td className="table-data">{tx.department || ""}</td>
      <td className="table-data text-xs">{formatDate(tx.updatedAt)}</td>
    </tr>
  );
}

export default TableRow;
