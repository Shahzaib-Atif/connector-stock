import { API } from "@/utils/api";
import { QRData } from "@/utils/types";
import { useState } from "react";

export default function usePrinting(qrData: QRData, itemIdLink: string) {
  const { id: itemId, source, refCliente, encomenda, qty } = qrData;

  const [isPrinting, setIsPrinting] = useState(false);
  const [printQty, setPrintQty] = useState(qty || 1);
  const [printStatus, setPrintStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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

  return { isPrinting, printStatus, printQty, handlePrint, setPrintQty };
}
