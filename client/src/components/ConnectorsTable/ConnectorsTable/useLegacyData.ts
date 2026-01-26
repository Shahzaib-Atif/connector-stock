import { fetchLegacyBackups } from "@/api/legacyApi";
import { mapLegacyToConnector } from "@/services/connectorService";
import { useAppSelector } from "@/store/hooks";
import { Connector } from "@/utils/types";
import { useEffect, useState } from "react";

export const useLegacyData = () => {
  const [isLegacyMode, setIsLegacyMode] = useState(false);
  const [legacyData, setLegacyData] = useState<Record<string, Connector>>({});
  const [legacyLoading, setLegacyLoading] = useState(false);

  const { data: masterData } = useAppSelector((state) => state.masterData);

  useEffect(() => {
    if (isLegacyMode && Object.keys(legacyData).length === 0 && masterData) {
      const loadLegacy = async () => {
        setLegacyLoading(true);
        try {
          const backups = await fetchLegacyBackups();
          const mapped: Record<string, Connector> = {};
          backups.forEach((b) => {
            const connector = mapLegacyToConnector(b, masterData);
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

  return { isLegacyMode, setIsLegacyMode, legacyData, legacyLoading };
};
