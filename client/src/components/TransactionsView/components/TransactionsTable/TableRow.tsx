import { ROUTES } from "@/components/AppRoutes";
import { Transaction, WireTypes } from "@/utils/types";
import { Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  tx: Transaction;
  index: number;
}
function TableRow({ tx, index }: Props) {
  const getLink = () => {
    const route =
      tx.itemType === "connector" ? ROUTES.CONNECTORS : ROUTES.ACCESSORIES;
    const url = `${route}/${tx.itemId}`;
    return url;
  };

  return (
    <tr key={tx.ID} className="table-row table-row-bg">
      <td className="table-data text-slate-300 font-mono text-xs">{index}</td>
      <td className="table-data">
        <div className="flex items-center gap-1">
          <span className="text-slate-300 font-mono">{tx.itemId}</span>
          <Link
            to={getLink()}
            className="text-slate-400 hover:text-blue-400 transition-colors p-1"
            title={`Open ${tx.itemId} in new tab`}
          >
            <LinkIcon className="w-4 h-4" />
          </Link>
        </div>
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
      <td className="table-data">{tx.sender || ""}</td>
      <td className="table-data">{tx.department || ""}</td>
      <td className="table-data text-xs font-mono text-slate-400">
        {tx.encomenda}
      </td>
      <td className="table-data text-xs text-slate-400 italic">
        {tx.notes || "-"}
      </td>
      <td className="table-data text-xs text-slate-400 italic">
        {getCfioStatus(tx.subType)}
      </td>
      <td className="table-data font-mono">{tx.updatedAt || "-"}</td>
    </tr>
  );
}

function getCfioStatus(subType?: WireTypes) {
  if (subType === WireTypes.COM_FIO) {
    return "c/fio";
  } else if (subType === WireTypes.SEM_FIO) {
    return "sem/fio";
  } else return "-";
}

export default TableRow;
