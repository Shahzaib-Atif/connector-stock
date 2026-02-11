import { useClickOutside } from "@/hooks/useClickOutside";
import { useEscKeyDown } from "@/hooks/useEscKeyDown";
import { QRData } from "@/utils/types/shared";
import React, { useRef } from "react";
import ActionButtons from "./components/ActionButtons";
import { getItemIdLink } from "./components/getItemId";
import usePrinting from "./components/usePrinting";
import QuantitySelector from "./components/QuantitySelector";
import PrintWarning from "./components/PrintWarning";
import PrintStatus from "./components/PrintStatus";
import LabelSizeSelector from "./components/LabelSizeSelector";
import PrinterSelector from "./components/PrinterSelector";

interface QRModalProps {
  qrData: QRData;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ qrData, onClose }) => {
  const { id: itemId } = qrData;
  const itemIdLink = getItemIdLink(itemId);

  const {
    isPrinting,
    printStatus,
    printQty,
    useSmallLabels,
    handlePrint,
    setPrintQty,
    setUseSmallLabels,
    selectedPrinter,
    setSelectedPrinter,
  } = usePrinting(qrData, itemIdLink);

  const ref = useRef<HTMLDivElement | null>(null);
  useClickOutside(ref, onClose);
  useEscKeyDown(ref, onClose);

  const qrServerUrl = import.meta.env.VITE_QRSERVER_URL;

  return (
    <div
      id="qr-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
    >
      <div
        ref={ref}
        className="bg-slate-800 w-full max-w-md rounded-2xl p-4 sm:p-8 shadow-2xl text-center border border-slate-700"
      >
        {/* Title */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white tracking-tight">
            Scan Code
          </h3>
          <p className="text-slate-400 text-sm">Print this for {itemId}</p>
        </div>

        {/* Image */}
        <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-md">
          <img
            src={`${qrServerUrl}${itemIdLink}`}
            alt="QR Code"
            className="w-48 h-48"
          />
        </div>

        <div className="font-mono text-2xl font-bold text-white mb-6 tracking-widest break-all">
          {itemId}
        </div>

        {/* Quantity selector */}
        <div className="mb-8">
          <QuantitySelector printQty={printQty} setPrintQty={setPrintQty} />
        </div>

        {/* Warning for large quantity */}
        {printQty > 10 && <PrintWarning printQty={printQty} />}

        {/* Print Status */}
        {printStatus && (
          <div className="mb-6">
            <PrintStatus printStatus={printStatus} />
          </div>
        )}

        <ActionButtons
          isPrinting={isPrinting}
          handlePrint={handlePrint}
          onClose={onClose}
        />

        {/* Separator Divider */}
        <div className="relative flex items-center gap-4 my-2 mt-8 py-2">
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap bg-slate-800 px-2">
            Extra Settings
          </span>
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
        </div>

        <div className="flex flex-col gap-5 w-full">
          {/* Printer Selection Row */}
          <div className={divStyle1}>
            <span className={labelStyle1}>Printer:</span>
            <PrinterSelector
              selectedPrinter={selectedPrinter}
              setSelectedPrinter={setSelectedPrinter}
            />
          </div>

          {/* Label Size Selection Row */}
          <div className={divStyle1}>
            <span className={labelStyle1}>Label Size:</span>
            <LabelSizeSelector
              useSmallLabels={useSmallLabels}
              setUseSmallLabels={setUseSmallLabels}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const divStyle1 = "flex flex-row justify-center gap-2 items-center w-full px-2";
const labelStyle1 =
  "text-xs font-bold text-slate-500 uppercase tracking-widest";
