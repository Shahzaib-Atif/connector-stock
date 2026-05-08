import { RequestState } from "@/utils/types/RequestState";
import { API } from "@/utils/api";
import { QRData } from "@/utils/types";
import { useState } from "react";
import { STORAGE_KEYS } from "@/utils/constants";
import usePrinterSelection from "./useSelectPrinter";
import usePrinterLabelSizeSelection from "./usePrinterLabelSizeSelection";

export default function usePrinting(qrData: QRData, itemIdLink: string) {
  const { id: itemId, source, refCliente, encomenda, qty } = qrData;

  const [isPrinting, setIsPrinting] = useState(false);
  const [printQty, setPrintQty] = useState(qty || 1);
  const { selectedPrinter, updatePrinter } = usePrinterSelection(
    STORAGE_KEYS.SELECTED_PRINTER,
  );

  const [printStatus, setPrintStatus] = useState<{
    type: RequestState;
    message: string;
  } | null>(null);

  const { useSmallLabels, updateLabelSize } = usePrinterLabelSizeSelection(
    STORAGE_KEYS.USE_SMALL_LABELS,
  );

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
          printer: selectedPrinter,
          useSmallLabels,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPrintStatus({ type: "success", message: "Label sent to printer!" });
      } else {
        setPrintStatus({
          type: "error",
          message: "Print failed! Please check the printer connection.",
        });
      }
    } catch (error) {
      console.error("Print error:", error);
      setPrintStatus({
        type: "error",
        message: "Could not connect to print server",
      });
    } finally {
      setIsPrinting(false);
    }
  };

  return {
    isPrinting,
    printStatus,
    printQty,
    useSmallLabels,
    handlePrint,
    setPrintQty,
    setUseSmallLabels: updateLabelSize,
    selectedPrinter,
    setSelectedPrinter: updatePrinter,
  };
}
