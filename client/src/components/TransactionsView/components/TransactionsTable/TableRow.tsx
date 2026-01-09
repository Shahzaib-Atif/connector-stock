import { ROUTES } from "@/components/AppRoutes";
import { Transaction } from "@/utils/types";
import { ExternalLink } from "lucide-react";

interface Props {
  tx: Transaction;
  index: number;
}
function TableRow({ tx, index }: Props) {
  const handleOpenLink = () => {
    const route =
      tx.itemType === "connector" ? ROUTES.CONNECTORS : ROUTES.ACCESSORIES;
    const url = `${route}/${tx.itemId}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <tr key={tx.ID} className="table-row table-row-bg">
      <td className="table-data text-slate-300 font-mono text-xs">{index}</td>
      <td className="table-data">
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-mono">{tx.itemId}</span>
          <button
            onClick={handleOpenLink}
            className="text-slate-400 hover:text-blue-400 transition-colors p-1"
            title={`Open ${tx.itemId} in new tab`}
          >
            <ExternalLink className="w-4 h-4" />
          </button>
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
      <td className="table-data">{tx.department || ""}</td>
      <td className="table-data font-mono">{tx.updatedAt || "-"}</td>
    </tr>
  );
}

export default TableRow;
