import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { initStockData } from "./store/stockSlice";
import { initMasterData } from "./store/masterDataSlice";
import { useTransactionFlow } from "./hooks/useTransactionFlow";

// Components
import { Login } from "./components/Login";
import { TransactionModal } from "./components/TransactionModal";
import { QRModal } from "./components/QRModal";
import { AppRoutes } from "./components/AppRoutes";
import { useScan } from "./hooks/useScan";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.masterData);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState("");
  const { handleScan, error, clearError } = useScan();

  const tx = useTransactionFlow();

  useEffect(() => {
    dispatch(initMasterData());
    dispatch(initStockData());
  }, [dispatch]);

  const handleOpenQR = (id: string) => {
    setActiveItemId(id);
    setQrModalOpen(true);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

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

      {qrModalOpen && (
        <QRModal itemId={activeItemId} onClose={() => setQrModalOpen(false)} />
      )}

      {tx.isOpen && (
        <TransactionModal
          type={tx.txType}
          targetId={tx.targetId}
          onClose={tx.closeTransaction}
          onConfirm={tx.handleSubmit}
        />
      )}
    </>
  );
};

export default App;
