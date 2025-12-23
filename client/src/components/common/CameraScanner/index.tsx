import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X } from "lucide-react";
import { startScanner } from "./startScanner";
import { useQrScanner } from "./useQrScanner";

interface CameraScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onScan,
  onClose,
}) => {
  const regionId = "reader"; // ID of the HTML element to render the scanner
  const { error, isSecure } = useQrScanner(regionId, onScan, onClose);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 absolute top-0 left-0 right-0 z-10 bg-slate-900/80 backdrop-blur-md">
          <h3 className="text-slate-300 font-bold px-2">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Container */}
        <div
          id={regionId}
          className="w-full aspect-square bg-black overflow-hidden relative"
          style={{ minHeight: "300px" }}
        >
          {/* Scanning Line Animation */}
          <div className="absolute left-0 right-0 h-0.5 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10 animate-scanner-line pointer-events-none" />

          {/* Corner Guides */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] border-2 border-blue-500/30 rounded-lg z-10 pointer-events-none">
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-slate-900/90">
              <div>
                <p className="text-red-400 font-medium mb-3">{error}</p>
                {!isSecure ? (
                  <div className="text-slate-400 text-xs space-y-2">
                    <p>
                      Browsers block camera access on non-secure (HTTP) IP
                      addresses.
                    </p>
                    <p className="font-bold text-blue-400">
                      Fix: Use HTTPS or access via 'localhost'
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">
                    Please ensure camera permissions are granted and no other
                    app is using it.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-6 text-center space-y-2">
          <p className="text-blue-400 font-medium">
            Place the code inside the box
          </p>
          <p className="text-slate-500 text-xs">
            Using your device camera to detect item codes
          </p>
        </div>
      </div>
    </div>
  );
};
