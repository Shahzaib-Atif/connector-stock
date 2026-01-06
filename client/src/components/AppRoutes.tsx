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
import { NotificationsView } from "./NotificationsView";
import { QRData } from "@/types";

interface AppRoutesProps {
  onScan: (code: string) => void;
  scanError: string | null;
  onClearScanError: () => void;
  onOpenQR: (qrData: QRData) => void;
  onTransaction: (type: "IN" | "OUT", id?: string) => void;
}

import { Login } from "./Login";
import { UsersView } from "./UsersView";

export const AppRoutes: React.FC<AppRoutesProps> = ({
  onScan,
  scanError,
  onClearScanError,
  onOpenQR,
  onTransaction,
}) => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.USERS} element={<UsersView />} />
      <Route
        path={ROUTES.HOME}
        element={
          <HomeView
            onScan={onScan}
            scanError={scanError}
            onClearScanError={onClearScanError}
          />
        }
      />
      <Route
        path={ROUTES.CONNECTOR_VIEW}
        element={
          <ConnectorView onOpenQR={onOpenQR} onTransaction={onTransaction} />
        }
      />
      <Route path={ROUTES.BOX_VIEW} element={<BoxView onOpenQR={onOpenQR} />} />
      <Route
        path={ROUTES.ACCESSORY_VIEW}
        element={
          <AccessoryView onOpenQR={onOpenQR} onTransaction={onTransaction} />
        }
      />
      <Route path={ROUTES.TRANSACTIONS} element={<TransactionsView />} />
      <Route
        path={ROUTES.SAMPLES}
        element={<SamplesView onOpenQR={onOpenQR} />}
      />
      <Route path={ROUTES.CONNECTORS} element={<ConnectorsListView />} />
      <Route path={ROUTES.ACCESSORIES} element={<AccessoriesListView />} />
      <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsView />} />
    </Routes>
  );
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  USERS: "/users",
  BOXES: "/boxes",
  CONNECTOR_VIEW: "/connectors/:id",
  BOX_VIEW: "/boxes/:id",
  ACCESSORY_VIEW: "/accessories/:id",
  TRANSACTIONS: "/transactions",
  SAMPLES: "/samples",
  CONNECTORS: "/connectors",
  ACCESSORIES: "/accessories",
  NOTIFICATIONS: "/notifications",
};
