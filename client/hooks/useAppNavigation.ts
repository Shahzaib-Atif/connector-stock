import { useState } from 'react';
import { AppView, Connector, Box, Accessory } from '../types';
import { parseConnector, getBoxDetails, parseAccessory, searchByClientRef } from '../services/inventoryService';
import { useAppSelector } from '../store/hooks';

interface NavigationSnapshot {
  view: AppView;
  activeConnector: Connector | null;
  activeBox: Box | null;
  activeAccessory: Accessory | null;
  searchQuery: string;
  searchResults: Connector[];
}

export const useAppNavigation = () => {
  const { stockCache } = useAppSelector(state => state.stock);
  
  const [view, setView] = useState<AppView>('HOME');
  const [history, setHistory] = useState<NavigationSnapshot[]>([]);
  
  // Selected Entities
  const [activeConnector, setActiveConnector] = useState<Connector | null>(null);
  const [activeBox, setActiveBox] = useState<Box | null>(null);
  const [activeAccessory, setActiveAccessory] = useState<Accessory | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Connector[]>([]);

  // Push current state to history before navigating
  const navigateTo = (action: () => void) => {
    setHistory(prev => [...prev, {
      view,
      activeConnector,
      activeBox,
      activeAccessory,
      searchQuery,
      searchResults
    }]);
    action();
  };

  const goBack = () => {
    if (history.length === 0) {
      goHome();
      return;
    }
    
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1)); // Pop
    
    setView(prev.view);
    setActiveConnector(prev.activeConnector);
    setActiveBox(prev.activeBox);
    setActiveAccessory(prev.activeAccessory);
    setSearchQuery(prev.searchQuery);
    setSearchResults(prev.searchResults);
  };

  const goHome = () => {
    setHistory([]);
    setView('HOME');
    setActiveConnector(null);
    setActiveBox(null);
    setActiveAccessory(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleScan = (inputCode: string) => {
    const code = inputCode.trim();
    const upperCode = code.toUpperCase();
    
    // Numeric check for Client Ref
    if (/^\d+$/.test(code)) {
        const ref = parseInt(code, 10);
        // If numeric and length >= 3, assume Client Ref search
        if (code.length >= 3) {
            const results = searchByClientRef(ref);
            navigateTo(() => {
              setSearchResults(results);
              setSearchQuery(code);
              setView('SEARCH_RESULTS');
            });
            return;
        }
    }

    if (code.includes('_')) {
        // Accessory Mode
        const acc = parseAccessory(code, stockCache);
        navigateTo(() => {
          setActiveAccessory(acc);
          setActiveConnector(null);
          setActiveBox(null);
          setView('ACCESSORY_DETAILS');
        });
    } else if (code.length === 6) {
      // Connector Mode
      const connector = parseConnector(upperCode, stockCache);
      navigateTo(() => {
        setActiveConnector(connector);
        setActiveBox(null);
        setActiveAccessory(null);
        setView('CONNECTOR_DETAILS');
      });
    } else if (code.length === 4) {
      // Box Mode
      const box = getBoxDetails(upperCode);
      if (box) {
        navigateTo(() => {
          setActiveBox(box);
          setActiveConnector(null);
          setActiveAccessory(null);
          setView('BOX_DETAILS');
        });
      } else {
        alert('Box not found');
      }
    } else {
      alert('Invalid Code. Box ID (4 chars), Connector ID (6 chars), Accessory ID (Conn_Ref), or Client Ref (Numeric) expected.');
    }
  };

  const openConnector = (conn: Connector) => {
      navigateTo(() => {
        setActiveConnector(conn);
        setView('CONNECTOR_DETAILS');
      });
  };

  const getActiveItemId = () => {
    if (view === 'CONNECTOR_DETAILS') return activeConnector?.id || '';
    if (view === 'BOX_DETAILS') return activeBox?.id || '';
    if (view === 'ACCESSORY_DETAILS') return activeAccessory?.id || '';
    return '';
  };

  return {
    view,
    activeConnector,
    setActiveConnector,
    activeBox,
    activeAccessory,
    setActiveAccessory,
    searchQuery,
    searchResults,
    handleScan,
    goHome,
    goBack,
    openConnector,
    getActiveItemId
  };
};