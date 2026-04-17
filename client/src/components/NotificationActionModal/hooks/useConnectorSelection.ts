import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { AppNotification } from "@shared/types/Notification";
import { ConnectorExtended } from "@/utils/types";

function getMatches(base: string, keys: string[]) {
  return keys.filter((k) => k === base || k.startsWith(`${base}-`)).sort();
}

export function useConnectorSelection(notification: AppNotification | null) {
  const masterData = useAppSelector((s) => s.masterData.data);
  const [selectedConnectorId, setSelectedConnectorId] = useState<
    string | undefined
  >(undefined);

  const connectorOptions = useMemo(() => {
    const base = notification?.parsedConector;
    const connectors = masterData?.connectors;
    if (!connectors || !base || base === "?" || notification?.linkedConnector) {
      return [];
    }
    return getMatches(base, Object.keys(connectors));
  }, [masterData?.connectors, notification?.linkedConnector, notification?.parsedConector]);

  // If the backend couldn't link but we have exactly one version locally, auto-select it.
  useEffect(() => {
    if (notification?.linkedConnector) return;
    const base = notification?.parsedConector;
    const connectors = masterData?.connectors;
    if (!connectors || !base || base === "?") return;

    const matches = getMatches(base, Object.keys(connectors));
    if (matches.length === 1) {
      setSelectedConnectorId(matches[0]);
    }
  }, [masterData?.connectors, notification?.linkedConnector, notification?.parsedConector]);

  const effectiveConnector = useMemo(() => {
    if (notification?.linkedConnector) return notification.linkedConnector;
    if (selectedConnectorId && masterData?.connectors?.[selectedConnectorId]) {
      return masterData.connectors[selectedConnectorId] as ConnectorExtended;
    }
    return undefined;
  }, [masterData?.connectors, notification?.linkedConnector, selectedConnectorId]);

  return {
    connectorOptions,
    selectedConnectorId,
    setSelectedConnectorId,
    effectiveConnector,
  };
}

