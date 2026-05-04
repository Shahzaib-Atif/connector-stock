import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { initMasterData } from "./store/slices/masterDataSlice";
import { fetchOrcSamplesThunk } from "./store/slices/samplesSlice";
import { useTransactionFlow } from "./hooks/useTransactionFlow";

// Components
import { QRModal } from "./components/QRModal";
import { AppRoutes } from "./components/AppRoutes";
import { useScan } from "./hooks/useScan";
import { TransactionModal } from "./components/TransactionModal";
import { initTransactionsData } from "./store/slices/transactionsSlice";
import { initUsersList } from "./store/slices/authSlice";
import { QRData } from "./utils/types/shared";
import { NotificationPopup } from "./components/common/NotificationPopup";
import { useBackgroundRefresh } from "./hooks/useBackgroundRefresh";
import { useAuthExpiredListener } from "./hooks/useAuthExpiredListener";

const BACKGROUND_REFRESH_INTERVAL_MS = 1 * 60 * 1000; // 1 minute

// Main App Component
const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.masterData);
  const [qrData, setQrData] = useState<QRData | null>(null);
  const { handleScan, error, clearError } = useScan();

  const {
    isOpen,
    txType,
    targetId,
    openTransaction,
    closeTransaction,
    handleSubmit,
    itemType,
  } = useTransactionFlow();

  useEffect(() => {
    dispatch(initMasterData());
    dispatch(initTransactionsData());
    dispatch(initUsersList());
    dispatch(fetchOrcSamplesThunk());
  }, [dispatch]);

  // Set up a background refresh mechanism that periodically updates critical data
  useBackgroundRefresh(BACKGROUND_REFRESH_INTERVAL_MS);

  // Listen for auth expiration events to automatically log out the user
  useAuthExpiredListener();

  const handleOpenQR = (qrData: QRData) => {
    setQrData(qrData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <AppRoutes
        onScan={handleScan}
        scanError={error}
        onClearScanError={clearError}
        onOpenQR={handleOpenQR}
        onTransaction={openTransaction}
      />

      <NotificationPopup />

      {qrData && <QRModal qrData={qrData} onClose={() => setQrData(null)} />}

      {isOpen && (
        <TransactionModal
          transactionType={txType}
          targetId={targetId || ""}
          onClose={closeTransaction}
          onConfirm={handleSubmit}
          itemType={itemType}
        />
      )}
    </>
  );
};

export default App;
