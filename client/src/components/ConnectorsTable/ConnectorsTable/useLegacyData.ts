import { fetchLegacyBackups } from "@/api/legacyApi";
import { mapLegacyToConnector } from "@/utils/functions/connector";
import { useAppSelector } from "@/store/hooks";
import { ConnectorExtended, ConnectorMap } from "@/utils/types";
import { useEffect, useState } from "react";
import { useLegacyToggle } from "./useLegacyToggle";
import { STORAGE_KEYS } from "@/utils/constants";

export const useLegacyData = () => {
  const { isLegacyMode, setIsLegacyMode } = useLegacyToggle(
    STORAGE_KEYS.CONNECTORS_LEGACY_MODE,
  );
  const [legacyData, setLegacyData] = useState<ConnectorMap>({});
  const [legacyLoading, setLegacyLoading] = useState(false);

  const { data: masterData } = useAppSelector((state) => state.masterData);

  useEffect(() => {
    if (isLegacyMode && Object.keys(legacyData).length === 0 && masterData) {
      const loadLegacy = async () => {
        setLegacyLoading(true);
        try {
          const backups = await fetchLegacyBackups();
          const mapped: ConnectorMap = {};
          backups.forEach((b) => {
            const connector = mapLegacyToConnector(b);
            mapped[connector.CODIVMAC] = connector;
          });
          setLegacyData(mapped);
        } catch (err) {
          console.error("Failed to load legacy data", err);
        } finally {
          setLegacyLoading(false);
        }
      };

      loadLegacy();
    }
  }, [isLegacyMode, masterData]);

  const updateLegacyConnector = (
    connectorId: string,
    connectorPatch: Partial<ConnectorExtended>,
  ) => {
    setLegacyData((prev) => {
      const existing = prev[connectorId];
      if (!existing) return prev;

      return {
        ...prev,
        [connectorId]: {
          ...existing,
          ...connectorPatch,
        },
      };
    });
  };

  return {
    isLegacyMode,
    setIsLegacyMode,
    legacyData,
    legacyLoading,
    updateLegacyConnector,
  };
};
