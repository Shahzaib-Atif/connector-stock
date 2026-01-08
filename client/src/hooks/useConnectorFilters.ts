import { Connector } from "@/utils/types/types";
import { useState, useMemo, useCallback } from "react";

export type ConnectorFilterColumn = "all" | "id" | "type" | "fabricante";

interface ConnectorFilters {
  filterColumn: ConnectorFilterColumn;
  searchQuery: string;
}

interface UseConnectorFiltersReturn {
  filters: ConnectorFilters;
  setFilterColumn: (column: ConnectorFilterColumn) => void;
  setSearchQuery: (query: string) => void;
  filteredConnectors: Connector[];
  clearFilters: () => void;
}

export function useConnectorFilters(
  connectors: Record<string, Connector>
): UseConnectorFiltersReturn {
  const [filters, setFilters] = useState<ConnectorFilters>({
    filterColumn: "all",
    searchQuery: "",
  });

  const setFilterColumn = useCallback((column: ConnectorFilterColumn) => {
    setFilters((prev) => ({ ...prev, filterColumn: column }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ filterColumn: "all", searchQuery: "" });
  }, []);

  // Convert Record to array with id
  const connectorsList = useMemo((): Connector[] => {
    return Object.entries(connectors).map(([id, connector]) => ({
      id,
      ...connector,
    }));
  }, [connectors]);

  const filteredConnectors = useMemo(() => {
    const normalizedQuery = filters.searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return connectorsList;
    }

    return connectorsList.filter((connector) => {
      if (filters.filterColumn === "all") {
        return matchesAnyField(connector, normalizedQuery);
      } else {
        const columnValue = getColumnValue(connector, filters.filterColumn);
        return columnValue.includes(normalizedQuery);
      }
    });
  }, [connectorsList, filters]);

  return {
    filters,
    setFilterColumn,
    setSearchQuery,
    filteredConnectors,
    clearFilters,
  };
}

function matchesAnyField(connector: Connector, normalizedQuery: string) {
  return (
    connector.CODIVMAC.toLowerCase().includes(normalizedQuery) ||
    connector.CODIVMAC?.toLowerCase().includes(normalizedQuery) ||
    connector.ConnType?.toLowerCase().includes(normalizedQuery) ||
    connector.details.Fabricante?.toLowerCase().includes(normalizedQuery) ||
    connector.details.Refabricante?.toLowerCase().includes(normalizedQuery) ||
    connector.Cor?.toLowerCase().includes(normalizedQuery) ||
    connector.Vias?.toLowerCase().includes(normalizedQuery)
  );
}

const getColumnValue = (
  connector: Connector,
  column: ConnectorFilterColumn
): string => {
  switch (column) {
    case "id":
      return connector.CODIVMAC?.toLowerCase() ?? "";
    case "type":
      return connector.ConnType?.toLowerCase() ?? "";
    case "fabricante":
      return connector.details.Fabricante?.toLowerCase() ?? "";
    default:
      return "";
  }
};
