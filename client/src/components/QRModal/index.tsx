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
import SelectPrinterBtn from "./components/SelectPrinterBtn";
import { Printer_t } from "@/types/printers";

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
    handlePrint,
    setPrintQty,
    selectedPrinter,
    setSelectedPrinter,
  } = usePrinting(qrData, itemIdLink);

  const ref = useRef<HTMLDivElement | null>(null);
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
        {/* Title */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white">Scan Code</h3>
          <p className="text-slate-400 text-sm">Print this for {itemId}</p>
        </div>

        {/* Image */}
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
        <QuantitySelector printQty={printQty} setPrintQty={setPrintQty} />

        {/* Warning for large quantity */}
        {printQty > 10 && <PrintWarning printQty={printQty} />}

        {/* Print Status */}
        {printStatus && <PrintStatus printStatus={printStatus} />}

        <div className="mb-6 flex flex-col items-center justify-center gap-2">
          {/* Printer Selection */}
          <div
            className={`flex items-center gap-3 p-1 rounded-lg bg-slate-700/50 border border-slate-600 transition-all`}
          >
            {/* printer 1 */}
            <SelectPrinterBtn
              myPrinter={Printer_t.PRINTER_1}
              selectedPrinter={selectedPrinter}
              setSelectedPrinter={setSelectedPrinter}
            />

            {/* printer 2 */}
            <SelectPrinterBtn
              myPrinter={Printer_t.PRINTER_2}
              selectedPrinter={selectedPrinter}
              setSelectedPrinter={setSelectedPrinter}
            />
          </div>
        </div>

        <ActionButtons
          isPrinting={isPrinting}
          handlePrint={handlePrint}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
