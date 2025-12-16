import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomeView } from "./HomeView";
import { ConnectorView } from "./ConnectorView";
import { BoxView } from "./BoxView";
import { AccessoryView } from "./AccessoryView";
import { TransactionsView } from "./TransactionsView";
import { SamplesView } from "./SamplesView";
import { ConnectorsListView } from "./ConnectorsListView";
import { AccessoriesListView } from "./AccessoriesListView";
import { QRData } from "@/types";

interface AppRoutesProps {
  onScan: (code: string) => void;
  scanError: string | null;
  onClearScanError: () => void;
  onOpenQR: (qrData: QRData) => void;
  onTransaction: (type: "IN" | "OUT", id?: string) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  onScan,
  scanError,
  onClearScanError,
  onOpenQR,
  onTransaction,
}) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomeView
            onScan={onScan}
            scanError={scanError}
            onClearScanError={onClearScanError}
          />
        }
      />
      <Route
        path="/connector/:id"
        element={
          <ConnectorView onOpenQR={onOpenQR} onTransaction={onTransaction} />
        }
      />
      <Route path="/box/:id" element={<BoxView onOpenQR={onOpenQR} />} />
      <Route
        path="/accessory/:id"
        element={
          <AccessoryView onOpenQR={onOpenQR} onTransaction={onTransaction} />
        }
      />
      <Route path="/transactions" element={<TransactionsView />} />
      <Route path="/samples" element={<SamplesView onOpenQR={onOpenQR} />} />
      <Route path="/connectors" element={<ConnectorsListView />} />
      <Route path="/accessories" element={<AccessoriesListView />} />
    </Routes>
  );
};
