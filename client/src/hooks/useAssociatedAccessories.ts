import { useAppSelector } from "@/store/hooks";
import { useEffect, useMemo, useState } from "react";

export function useAssociatedAccessories(targetId: string) {
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>(
    []
  );
  const { data: masterData } = useAppSelector((state) => state.masterData);

  // Derive associated accessories if targetId is a connector
  const associatedAccessories = useMemo(() => {
    if (!masterData) return [];

    // check if targetId is a connector
    const isConnector = !!masterData.connectors[targetId];
    if (!isConnector) return [];

    // Filter accessories that belong to this connector
    return (
      Object.entries(masterData.accessories)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, acc]) => acc.ConnName === targetId)
        .map(([id, acc]) => ({
          id,
          ...acc,
          stock: acc.Qty || 0,
          type: acc.AccessoryType,
          refClient: acc.RefClient,
        }))
    );
  }, [masterData, targetId]);

  // Reset selected accessories when targetId changes
  useEffect(() => {
    setSelectedAccessoryIds([]);
  }, [targetId]);

  return {
    selectedAccessoryIds,
    associatedAccessories,
    setSelectedAccessoryIds,
  };
}
