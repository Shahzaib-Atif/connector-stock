import { useClickOutside } from "@/hooks/useClickOutside";
import { useEscKeyDown } from "@/hooks/useEscKeyDown";
import { API } from "@/utils/api";
import { QRData } from "@/utils/types/shared";
import { Printer, Loader2, AlertTriangle } from "lucide-react";
import React, { useRef, useState } from "react";

interface QRModalProps {
  qrData: QRData;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ qrData, onClose }) => {
  const { id: itemId, source, refCliente, encomenda, qty } = qrData;
  const itemIdLink = getItemIdLink(itemId);
  const ref = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printQty, setPrintQty] = useState(qty || 1);
  const [printStatus, setPrintStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useClickOutside(ref, onClose);
  useEscKeyDown(ref, onClose);

  const handlePrint = async () => {
    setIsPrinting(true);
    setPrintStatus(null);

    try {
      const response = await fetch(API.printLabel, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          itemUrl: itemIdLink,
          source,
          refCliente,
          encomenda,
          qty: printQty,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPrintStatus({ type: "success", message: "Label sent to printer!" });
      } else {
        setPrintStatus({
          type: "error",
          message: result.message || "Print failed",
        });
      }
    } catch (error) {
      console.error(error.message);
      setPrintStatus({
        type: "error",
        message: "Could not connect to print server",
      });
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div
      id="qr-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
    >
      <div
        ref={ref}
        className="bg-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center border border-slate-700"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white">Scan Code</h3>
          <p className="text-slate-400 text-sm">Print this for {itemId}</p>
        </div>

        <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-inner">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${itemIdLink}`}
            alt="QR Code"
            className="w-48 h-48"
          />
        </div>

        <div className="font-mono text-xl font-bold text-white mb-4 tracking-wider break-all">
          {itemId}
        </div>

        {/* Quantity selector */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Print Quantity
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPrintQty(Math.max(1, printQty - 1))}
              className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center border border-slate-600 transition-colors"
            >
              -
            </button>
            <input
              type="number"
              value={printQty}
              onChange={(e) =>
                setPrintQty(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-16 bg-slate-900 border border-slate-700 rounded-lg py-1 text-center text-white font-bold focus:outline-none focus:border-blue-500"
              min="1"
            />
            <button
              onClick={() => setPrintQty(printQty + 1)}
              className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center border border-slate-600 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Warning for large quantity */}
        {printQty > 10 && (
          <div className="mb-6 flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-xs text-left animate-in zoom-in-95">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>
              Warning: You are about to print <strong>{printQty}</strong>{" "}
              labels. Please confirm before proceeding.
            </span>
          </div>
        )}

        {printStatus && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              printStatus.type === "success"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {printStatus.message}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-xl transition-colors border border-blue-500 flex items-center justify-center gap-2"
          >
            {isPrinting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Printing...
              </>
            ) : (
              <>
                <Printer className="w-5 h-5" />
                Print Label
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors border border-slate-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function getItemIdLink(itemId: string) {
  if (!itemId) return itemId;

  const code = itemId.trim();
  const upper = code.toUpperCase();

  // Return "Pure Data" string instead of a full URL
  // This makes the physical sticker resilient to network changes
  if (upper.length === 4) return `box:${itemId}`;
  else return `connector:${itemId}`;
}
