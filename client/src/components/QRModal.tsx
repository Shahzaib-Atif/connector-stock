import { useClickOutside } from "@/hooks/useClickOutside";
import { useEscKeyDown } from "@/hooks/useEscKeyDown";
import React, { useRef } from "react";

interface QRModalProps {
  itemId: string;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ itemId, onClose }) => {
  const itemIdLink = getItemIdLink(itemId);
  const ref = useRef(null);

  useClickOutside(ref, onClose);
  useEscKeyDown(ref, onClose);

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

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors border border-slate-600"
        >
          Close
        </button>
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
  else if (upper.length === 6) return `${networkUrl}/connector/${itemId}`;
  else if (upper.includes("_")) return `${networkUrl}/accessory/${itemId}`;

  return itemId;
}
