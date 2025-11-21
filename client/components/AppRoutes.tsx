import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomeView } from "./HomeView";
import { ConnectorView } from "./ConnectorView";
import { BoxView } from "./BoxView";
import { AccessoryView } from "./AccessoryView";
import { SearchView } from "./SearchView";

interface AppRoutesProps {
  onScan: (code: string) => void;
  onOpenQR: (id: string) => void;
  onTransaction: (type: "IN" | "OUT", id?: string) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  onScan,
  onOpenQR,
  onTransaction,
}) => {
  return (
    <Routes>
      <Route path="/" element={<HomeView onScan={onScan} />} />
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
      <Route path="/search" element={<SearchView />} />
    </Routes>
  );
};
