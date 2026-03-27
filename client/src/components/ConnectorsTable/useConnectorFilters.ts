import { ConnectorExtended, ConnectorMap, MasterData } from "@/utils/types";
import { parseConnector } from "@/services/connectorService";
import { useState, useMemo, useCallback, useEffect } from "react";
import { ConnectorFilters, defaultFilters, STORAGE_KEY } from "./constants";

export function useConnectorFilters(
  connectors: ConnectorMap,
  masterData?: MasterData | null,
) {
  const [filters, setFilters] = useState<ConnectorFilters>(() => {
    if (typeof window === "undefined") {
      return defaultFilters;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return defaultFilters;
      }
      const parsed = JSON.parse(stored) as Partial<ConnectorFilters>;
      return { ...defaultFilters, ...parsed };
    } catch {
      return defaultFilters;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // ignore write errors (e.g., storage full or unavailable)
    }
  }, [filters]);

  const setFilterField = useCallback(
    (key: keyof ConnectorFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Convert Record to array with id
  const connectorsList = useMemo((): ConnectorExtended[] => {
    return Object.entries(connectors).map(([id, connector]) => {
      if (masterData) {
        const parsed = parseConnector(id, masterData);
        if (parsed) return parsed;
      }
      return {
        id,
        ...connector,
      };
    });
  }, [connectors, masterData]);

  const typeOptions = useMemo(
    () => getUniqueOptions(connectorsList.map((c) => c.ConnType)),
    [connectorsList],
  );

  const fabricanteOptions = useMemo(
    () => getUniqueOptions(connectorsList.map((c) => c.details?.Fabricante)),
    [connectorsList],
  );

  const colorOptions = useMemo(
    () => getUniqueOptions(connectorsList.map((c) => c.Cor)),
    [connectorsList],
  );

  // Apply filters to connectors list
  const filteredConnectors = useMemo(() => {
    const normalizedIdQuery = filters.idQuery.trim().toLowerCase();
    const normalizedViasQuery = filters.vias.trim().toLowerCase();
    const normalizedFamilyQuery = filters.family.trim().toLowerCase();
    const normalizedIntQuery = filters.internalDiameter.trim().toLowerCase();
    const normalizedExtQuery = filters.externalDiameter.trim().toLowerCase();
    const normalizedThickQuery = filters.thickness.trim().toLowerCase();

    return connectorsList.filter((connector) => {
      const matchesId =
        !normalizedIdQuery ||
        connector.CODIVMAC?.toLowerCase().includes(normalizedIdQuery);

      const matchesType =
        filters.type === "all" || connector.ConnType === filters.type;

      const matchesFabricante =
        filters.fabricante === "all" ||
        connector.details?.Fabricante === filters.fabricante;

      const familyValue =
        connector.details?.Family !== undefined &&
        connector.details?.Family !== null
          ? String(connector.details?.Family)
          : "";
      const matchesFamily =
        !normalizedFamilyQuery ||
        familyValue.toLowerCase().includes(normalizedFamilyQuery);

      const matchesVias =
        !normalizedViasQuery ||
        connector.Vias?.toLowerCase().includes(normalizedViasQuery) ||
        connector.details?.ActualViaCount?.toString().includes(
          normalizedViasQuery,
        ) ||
        connector.viasName?.toLowerCase().includes(normalizedViasQuery);

      const matchesColor =
        filters.color === "all" || connector.Cor === filters.color;

      const internalValue =
        connector.dimensions?.InternalDiameter != null
          ? String(connector.dimensions.InternalDiameter)
          : "";
      const externalValue =
        connector.dimensions?.ExternalDiameter != null
          ? String(connector.dimensions.ExternalDiameter)
          : "";
      const thicknessValue =
        connector.dimensions?.Thickness != null
          ? String(connector.dimensions.Thickness)
          : "";

      const matchesInternal =
        !normalizedIntQuery ||
        internalValue.toLowerCase().includes(normalizedIntQuery);

      const matchesExternal =
        !normalizedExtQuery ||
        externalValue.toLowerCase().includes(normalizedExtQuery);

      const matchesThickness =
        !normalizedThickQuery ||
        thicknessValue.toLowerCase().includes(normalizedThickQuery);

      return (
        matchesId &&
        matchesType &&
        matchesFabricante &&
        matchesFamily &&
        matchesVias &&
        matchesColor &&
        matchesInternal &&
        matchesExternal &&
        matchesThickness
      );
    });
  }, [connectorsList, filters]);

  return {
    filters,
    setFilterField,
    filteredConnectors,
    clearFilters,
    typeOptions,
    fabricanteOptions,
    colorOptions,
  };
}

// Helper function to get unique, non-empty options from an array of values
function getUniqueOptions(
  values: Array<string | number | null | undefined>,
): string[] {
  const normalized = values
    .filter((v) => v !== undefined && v !== null && v !== "")
    .map((v) => String(v));

  const unique = Array.from(new Set(normalized));

  return unique.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base", numeric: true }),
  );
}
