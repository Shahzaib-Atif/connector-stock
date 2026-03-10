import { Connector } from "@/utils/types";
import { useState, useMemo, useCallback } from "react";

interface ConnectorFilters {
  idQuery: string;
  type: string;
  fabricante: string;
  family: string;
  vias: string;
  color: string;
  internalDiameter: string;
  externalDiameter: string;
  thickness: string;
}

export function useConnectorFilters(connectors: Record<string, Connector>) {
  const [filters, setFilters] = useState<ConnectorFilters>({
    idQuery: "",
    type: "all",
    fabricante: "all",
    family: "",
    vias: "all",
    color: "all",
    internalDiameter: "",
    externalDiameter: "",
    thickness: "",
  });

  const setIdQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, idQuery: query }));
  }, []);

  const setType = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, type: value }));
  }, []);

  const setFabricante = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, fabricante: value }));
  }, []);

  const setFamily = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, family: value }));
  }, []);

  const setVias = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, vias: value }));
  }, []);

  const setColor = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, color: value }));
  }, []);

  const setInternalDiameter = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, internalDiameter: value }));
  }, []);

  const setExternalDiameter = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, externalDiameter: value }));
  }, []);

  const setThickness = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, thickness: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      idQuery: "",
      type: "all",
      fabricante: "all",
      family: "",
      vias: "all",
      color: "all",
      internalDiameter: "",
      externalDiameter: "",
      thickness: "",
    });
  }, []);

  // Convert Record to array with id
  const connectorsList = useMemo((): Connector[] => {
    return Object.entries(connectors).map(([id, connector]) => ({
      id,
      ...connector,
    }));
  }, [connectors]);

  const typeOptions = useMemo(
    () => getUniqueOptions(connectorsList.map((c) => c.ConnType)),
    [connectorsList],
  );

  const fabricanteOptions = useMemo(
    () => getUniqueOptions(connectorsList.map((c) => c.details.Fabricante)),
    [connectorsList],
  );

  const viasOptions = useMemo(
    () => getUniqueOptions(connectorsList.map((c) => c.Vias)),
    [connectorsList],
  );

  const colorOptions = useMemo(
    () => getUniqueOptions(connectorsList.map((c) => c.Cor)),
    [connectorsList],
  );

  // Apply filters to connectors list
  const filteredConnectors = useMemo(() => {
    const normalizedIdQuery = filters.idQuery.trim().toLowerCase();
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
        connector.details.Fabricante === filters.fabricante;

      const familyValue =
        connector.details.Family !== undefined &&
        connector.details.Family !== null
          ? String(connector.details.Family)
          : "";
      const matchesFamily =
        !normalizedFamilyQuery ||
        familyValue.toLowerCase().includes(normalizedFamilyQuery);

      const matchesVias =
        filters.vias === "all" || connector.Vias === filters.vias;

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
    setIdQuery,
    setType,
    setFabricante,
    setFamily,
    setVias,
    setColor,
    setInternalDiameter,
    setExternalDiameter,
    setThickness,
    filteredConnectors,
    clearFilters,
    typeOptions,
    fabricanteOptions,
    viasOptions,
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
