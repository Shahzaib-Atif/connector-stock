import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { initStockData } from './store/stockSlice';
import { useAppNavigation } from './hooks/useAppNavigation';
import { useTransactionFlow } from './hooks/useTransactionFlow';

// Components
import { Login } from './components/Login';
import { ViewManager } from './components/ViewManager';
import { TransactionModal } from './components/TransactionModal';
import { QRModal } from './components/QRModal';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { loading } = useAppSelector(state => state.stock);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // --- Logic Hooks ---
  const nav = useAppNavigation();
  
  const tx = useTransactionFlow({
    activeConnector: nav.activeConnector,
    setActiveConnector: nav.setActiveConnector,
    activeAccessory: nav.activeAccessory,
    setActiveAccessory: nav.setActiveAccessory,
    currentView: nav.view
  });

  // --- Initialization ---
  useEffect(() => {
    dispatch(initStockData());
  }, [dispatch]);

  // --- Render Guard ---

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
      <ViewManager 
        view={nav.view}
        activeConnector={nav.activeConnector}
        activeBox={nav.activeBox}
        activeAccessory={nav.activeAccessory}
        searchQuery={nav.searchQuery}
        searchResults={nav.searchResults}
        onScan={nav.handleScan}
        onBack={nav.goBack}
        onOpenQR={() => setQrModalOpen(true)}
        onSelectConnector={nav.openConnector}
        onTransaction={tx.openTransaction}
      />

      {/* --- Global Modals --- */}

      {qrModalOpen && (
        <QRModal 
          itemId={nav.getActiveItemId()} 
          onClose={() => setQrModalOpen(false)} 
        />
      )}

      {tx.isOpen && (
        <TransactionModal 
          type={tx.txType}
          targetId={tx.targetId || nav.getActiveItemId()}
          onClose={tx.closeTransaction}
          onConfirm={tx.handleSubmit}
        />
      )}
    </>
  );
};

export default App;