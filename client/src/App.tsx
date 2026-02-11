import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { initMasterData } from "./store/slices/masterDataSlice";
import { useTransactionFlow } from "./hooks/useTransactionFlow";

// Components
import { QRModal } from "./components/QRModal";
import { AppRoutes } from "./components/AppRoutes";
import { useScan } from "./hooks/useScan";
import { TransactionModal } from "./components/TransactionModal";
import { initTransactionsData } from "./store/slices/transactionsSlice";
import { initUsersList, logout } from "./store/slices/authSlice";
import { AUTH_EXPIRED_EVENT } from "./utils/constants";
import { QRData } from "./utils/types/shared";

// Main App Component
const App: React.FC = () => {
  const dispatch = useAppDispatch();
  useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.masterData);
  const [qrData, setQrData] = useState<QRData | null>(null);
  const { handleScan, error, clearError } = useScan();

  const tx = useTransactionFlow();

  useEffect(() => {
    dispatch(initMasterData());
    dispatch(initTransactionsData());
    dispatch(initUsersList());
  }, [dispatch]);

  useEffect(() => {
    const handleAuthExpired = () => {
      dispatch(logout());
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () =>
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, [dispatch]);

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
        onTransaction={tx.openTransaction}
      />

      {qrData && <QRModal qrData={qrData} onClose={() => setQrData(null)} />}

      {tx.isOpen && (
        <TransactionModal
          type={tx.txType}
          targetId={tx.targetId || ""}
          onClose={tx.closeTransaction}
          onConfirm={tx.handleSubmit}
        />
      )}
    </>
  );
};

export default App;
