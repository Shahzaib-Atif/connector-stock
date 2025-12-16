import { useClickOutside } from "@/hooks/useClickOutside";
import { useEscKeyDown } from "@/hooks/useEscKeyDown";
import { QRData } from "@/types";
import { API } from "@/utils/api";
import { Printer, Loader2 } from "lucide-react";
import React, { useRef, useState } from "react";

interface QRModalProps {
  qrData: QRData;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({
  qrData: { id: itemId, source, refCliente, encomenda },
  onClose,
}) => {
  const itemIdLink = getItemIdLink(itemId);
  const ref = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
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

        <div className="font-mono text-xl font-bold text-white mb-6 tracking-wider break-all">
          {itemId}
        </div>

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

  const networkUrl = import.meta.env.VITE_NETWORK_BASE_URL;

  const code = itemId.trim();
  const upper = code.toUpperCase();

  if (upper.length === 4) return `${networkUrl}/box/${itemId}`;
  else return `${networkUrl}/connector/${itemId}`;
}
