import React from 'react';
import { AppView, Connector, Box, Accessory } from '../types';
import { HomeView } from './HomeView';
import { ConnectorView } from './ConnectorView';
import { BoxView } from './BoxView';
import { AccessoryView } from './AccessoryView';
import { SearchResultsView } from './SearchResultsView';

interface ViewManagerProps {
  view: AppView;
  activeConnector: Connector | null;
  activeBox: Box | null;
  activeAccessory: Accessory | null;
  searchQuery: string;
  searchResults: Connector[];
  onScan: (code: string) => void;
  onBack: () => void;
  onOpenQR: () => void;
  onSelectConnector: (c: Connector) => void;
  onTransaction: (type: 'IN' | 'OUT', id?: string) => void;
}

export const ViewManager: React.FC<ViewManagerProps> = ({
  view,
  activeConnector,
  activeBox,
  activeAccessory,
  searchQuery,
  searchResults,
  onScan,
  onBack,
  onOpenQR,
  onSelectConnector,
  onTransaction
}) => {
  switch (view) {
    case 'HOME':
      return <HomeView onScan={onScan} />;
    
    case 'CONNECTOR_DETAILS':
      if (!activeConnector) return null;
      return (
        <ConnectorView 
          connector={activeConnector}
          onBack={onBack}
          onScan={onScan}
          onOpenQR={onOpenQR}
          onTransaction={onTransaction}
        />
      );

    case 'BOX_DETAILS':
      if (!activeBox) return null;
      return (
        <BoxView 
          box={activeBox}
          onBack={onBack}
          onScan={onScan}
          onOpenQR={onOpenQR}
        />
      );

    case 'ACCESSORY_DETAILS':
      if (!activeAccessory) return null;
      return (
        <AccessoryView 
          accessory={activeAccessory}
          onBack={onBack}
          onScan={onScan}
          onOpenQR={onOpenQR}
          onTransaction={(type) => onTransaction(type)}
        />
      );

    case 'SEARCH_RESULTS':
      return (
        <SearchResultsView 
          query={searchQuery}
          results={searchResults}
          onBack={onBack}
          onSelect={onSelectConnector}
        />
      );

    default:
      return <HomeView onScan={onScan} />;
  }
};