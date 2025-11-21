import { useState } from 'react';
import { Department, Connector, Accessory } from '../types';
import { performTransaction } from '../services/inventoryService';
import { useAppDispatch } from '../store/hooks';
import { updateStock } from '../store/stockSlice';

interface UseTransactionFlowProps {
  activeConnector: Connector | null;
  setActiveConnector: (c: Connector) => void;
  activeAccessory: Accessory | null;
  setActiveAccessory: (a: Accessory) => void;
  currentView: string;
}

export const useTransactionFlow = ({
  activeConnector,
  setActiveConnector,
  activeAccessory,
  setActiveAccessory,
  currentView
}: UseTransactionFlowProps) => {
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [txType, setTxType] = useState<'IN' | 'OUT'>('IN');
  const [targetId, setTargetId] = useState<string | null>(null);

  const openTransaction = (type: 'IN' | 'OUT', specificTargetId?: string) => {
    setTxType(type);
    setTargetId(specificTargetId || null);
    setIsOpen(true);
  };

  const closeTransaction = () => {
    setIsOpen(false);
    setTargetId(null);
  };

  const handleSubmit = (amount: number, department?: Department) => {
    let finalTargetId = targetId;
    
    // Fallback to current active item if no specific target
    if (!finalTargetId) {
        if (currentView === 'CONNECTOR_DETAILS' && activeConnector) finalTargetId = activeConnector.id;
        else if (currentView === 'ACCESSORY_DETAILS' && activeAccessory) finalTargetId = activeAccessory.id;
        else return;
    }

    if (!finalTargetId) return;
    
    const delta = txType === 'IN' ? amount : -amount;
    const result = performTransaction(finalTargetId, delta, department);
    
    // Update Redux Store
    dispatch(updateStock({ 
        connectorId: finalTargetId, 
        amount: result.accessory ? result.accessory.stock : (result.connector?.stock || 0), 
        transaction: result.transaction 
    }));

    // Update local state reference to reflect change instantly in current view
    if (result.connector && activeConnector?.id === result.connector.id) setActiveConnector(result.connector);
    if (result.accessory && activeAccessory?.id === result.accessory.id) setActiveAccessory(result.accessory);

    closeTransaction();
  };

  return {
    isOpen,
    txType,
    targetId,
    openTransaction,
    closeTransaction,
    handleSubmit
  };
};