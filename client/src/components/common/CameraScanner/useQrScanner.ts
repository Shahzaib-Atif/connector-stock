import { Html5Qrcode } from "html5-qrcode";
import { startScanner } from "./startScanner";
import React, { useEffect, useRef } from "react";

// Custom hook to manage QR code scanning
export const useQrScanner = (
  regionId: string,
  onScan: (decodedText: string) => void,
  onClose: () => void
) => {
  const [error, setError] = React.useState<string | null>(null);
  const [isSecure, setIsSecure] = React.useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);

  // Initialize and start the QR scanner
  useEffect(() => {
    // Check for Secure Context (required for Camera access)
    if (!window.isSecureContext && window.location.hostname !== "localhost") {
      setIsSecure(false);
      setError("Insecure Context: Camera access requires HTTPS or localhost.");
      return;
    }

    // Create Html5Qrcode instance
    const html5QrCode = new Html5Qrcode(regionId);
    scannerRef.current = html5QrCode;

    // Start the scanner
    startScanner(html5QrCode, onScan, onClose, isRunningRef, setError);

    // Cleanup
    return () => {
      if (scannerRef.current && isRunningRef.current) {
        isRunningRef.current = false;
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear();
          })
          .catch((err) => console.warn("Failed to stop scanner", err));
      }
    };
  }, [onScan, onClose]);

  return { error, isSecure };
};
