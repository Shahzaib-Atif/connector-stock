import { Html5Qrcode } from "html5-qrcode";

const config = {
  fps: 10,
  qrbox: { width: 150, height: 150 },
  aspectRatio: 1.0,
};

export const startScanner = async (
  html5QrCode: Html5Qrcode,
  onScan: (decodedText: string) => void,
  onClose: () => void,
  isRunningRef: React.RefObject<boolean>,
  setError: (value: React.SetStateAction<string>) => void
) => {
  try {
    // Try to start with environment facing camera
    await html5QrCodeStart("environment", html5QrCode, onScan, onClose);

    // Mark as running
    isRunningRef.current = true;
  } catch (err: any) {
    // Fallback to user facing camera if environment not found or permission denied
    if (
      err?.toString().includes("NotFoundError") ||
      err?.toString().includes("NotAllowedError")
    ) {
      try {
        // Try to start with user facing camera
        await html5QrCodeStart("user", html5QrCode, onScan, onClose);

        // Mark as running
        isRunningRef.current = true;
      } catch (fallbackErr) {
        // Both attempts failed
        console.error("Failed to start scanner with fallback", fallbackErr);
        setError("Camera not found or permission denied");
      }
    } else {
      // Other errors
      console.error("Failed to start scanner", err);
      setError("Could not access camera");
    }
  }
};

// Helper function to start Html5Qrcode with specified facing mode
async function html5QrCodeStart(
  facingMode: "environment" | "user",
  html5QrCode: Html5Qrcode,
  onScan: (decodedText: string) => void,
  onClose: () => void
) {
  await html5QrCode.start(
    { facingMode },
    config,
    (decodedText) => {
      onScan(decodedText);
      onClose();
    },
    () => {}
  );
}
